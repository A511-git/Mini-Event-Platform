import {
  ValidateRefreshToken,
  GenerateAccessToken
} from "../utils/index.js";
import { ApiError } from "../utils/api-error.js";
import { REFRESH_EXPIRY } from "../config/index.js";
import { UserService } from "../services/user-service.js"
import { AsyncHandler } from "../utils/async-handler.js";
import { UserAuth } from "./middlewares/auth.js";
import { ApiResponse } from "../utils/api-response.js";

export const user = (app) => {
  const service = new UserService();
  // SIGNUP
  app.post("/user/signup", AsyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    const { data } = await service.SignUp({ email, password, name });

    res.status(201).json(new ApiResponse(201, data, "User registered successfully"));
  })
  );

  // LOGIN
  app.post("/user/login", AsyncHandler(async (req, res) => {
    const { data } = await service.SignIn(req.body);
    const { user, accessToken, refreshToken } = data;

    res.set("Authorization", `Bearer ${accessToken}`);
    res.set("Access-Control-Expose-Headers", "Authorization");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json(new ApiResponse(200, user, "Login successful"));
  }));

  // REFRESH
  app.get("/user/refresh", AsyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) throw new ApiError(401, "Refresh token missing");

    const payload = ValidateRefreshToken(token);
    const user = await service.repository.FindUserById({ id: payload._id }, true);

    if (!user || user.refreshToken !== token)
      throw new ApiError(401, "Invalid refresh token");

    const newAccessToken = GenerateAccessToken({
      _id: payload._id,
      email: payload.email
    });

    res.set("Authorization", `Bearer ${newAccessToken}`);
    res.set("Access-Control-Expose-Headers", "Authorization");

    res.status(200).json({ success: true });
  }));

  // LOGOUT
  app.get("/user/logout", UserAuth, AsyncHandler(async (req, res) => {
    await service.Logout({ _id: req.user._id });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.status(200).json(new ApiResponse(200, true, "Logout successful"));
  }));

  // PROFILE
  app.get("/user/profile", UserAuth, AsyncHandler(async (req, res) => {
    const { data } = await service.GetProfile({ _id: req.user._id });
    res.status(200).json(new ApiResponse(200, data, "Profile fetched"));
  }));
};
