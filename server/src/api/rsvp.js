import { RSVPService } from "../services/rsvp-service.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserAuth } from "./middlewares/auth.js";

export const rsvp = (app) => {
    const service = new RSVPService();
    app.post(
        "/event/:id/rsvp",
        UserAuth,
        AsyncHandler(async (req, res) => {
            const { data } = await service.JoinEvent({
                userId: req.user._id,
                eventId: req.params.id
            });

            res
                .status(200)
                .json(new ApiResponse(200, data, "RSVP successful"));
        })
    );

    app.delete(
        "/event/:id/rsvp",
        UserAuth,
        AsyncHandler(async (req, res) => {
            const { data } = await service.LeaveEvent({
                userId: req.user._id,
                eventId: req.params.id
            });

            res
                .status(200)
                .json(new ApiResponse(200, data, "RSVP removed"));
        })
    );
};
