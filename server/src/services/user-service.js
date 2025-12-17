import { UserRepository } from "../database/index.js";
import {
    GeneratePassword,
    GenerateSalt,
    GenerateAccessToken,
    GenerateRefreshToken,
    ValidatePassword,
    FormateData
} from "../utils/index.js";
import { ApiError } from "../utils/api-error.js";

class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    async SignIn({ email, password }) {
        const user = await this.repository.FindUser({ email }, true);
        if (!user) throw new ApiError(401, "Invalid email or password");

        const valid = await ValidatePassword(password, user.password);
        if (!valid) throw new ApiError(401, "Invalid email or password");

        const payload = { _id: user._id, email: user.email };

        const accessToken = GenerateAccessToken(payload);
        const refreshToken = GenerateRefreshToken(payload);

        await this.repository.UpdateRefreshToken({
            _id: user._id,
            refreshToken
        });

        return FormateData({
            user,
            accessToken,
            refreshToken
        });
    }

    async SignUp(userInputs) {
        const salt = await GenerateSalt();
        const password = await GeneratePassword(userInputs.password, salt);

        const user = await this.repository.CreateUser({
            ...userInputs,
            password
        });

        return FormateData(user);
    }

    async GetProfile({ _id }) {
        const user = await this.repository.FindUserById({ id: _id });
        if (!user) throw new ApiError(404, "User not found");
        return FormateData(user);
    }

    async Logout({ _id }) {
        await this.repository.UpdateRefreshToken({
            _id,
            refreshToken: null
        });
        return FormateData(true);
    }
}

export { UserService };
