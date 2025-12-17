import { UserModel } from "../models/index.js";
import { ApiError } from "../../utils/api-error.js";

class UserRepository {

  async CreateUser({ email, password, name }) {
    try {
      const user = new UserModel({ email, password, name });
      return await user.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ApiError(409, "User already exists");
      }
      throw new ApiError(500, "Unable to create user");
    }
  }

  async FindUser({ email }) {
    try {
      return await UserModel.findOne({ email }).select("+refreshToken");
    } catch {
      throw new ApiError(500, "Unable to find user");
    }
  }

  async FindUserById({ id }, includeRefreshToken = false) {
    try {
      const query = UserModel.findById(id);

      if (includeRefreshToken) {
        query.select("+refreshToken");
      }

      return await query;
    } catch {
      throw new ApiError(500, "Unable to find user");
    }
  }


  async UpdateRefreshToken({ _id, refreshToken }) {
    try {
      return await UserModel.findByIdAndUpdate(
        _id,
        { refreshToken },
        { new: true }
      );
    } catch {
      throw new ApiError(500, "Unable to update refresh token");
    }
  }
}

export { UserRepository };
