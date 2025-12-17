import { DashboardService } from "../services/dashboard-service.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserAuth } from "./middlewares/auth.js";

export const dashboard = (app) => {
    const service = new DashboardService();

    app.get(
        "/user/dashboard",
        UserAuth,
        AsyncHandler(async (req, res) => {
            const { data } = await service.GetUserDashboard(req.user._id);

            res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        data,
                        "User dashboard fetched successfully"
                    )
                );
        })
    );
};
