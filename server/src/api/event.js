import { EventService } from "../services/event-service.js";
import { AsyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserAuth } from "./middlewares/auth.js";
import { upload } from "../utils/multer.js";

export const event = (app) => {
    const service = new EventService();

    // CREATE EVENT (with image)
    app.post(
        "/event",
        UserAuth,
        upload.single("image"),
        AsyncHandler(async (req, res) => {
            const { data } = await service.CreateEvent({
                userId: req.user._id,
                eventData: req.body,
                image: req.file
            });

            res
                .status(201)
                .json(new ApiResponse(201, data, "Event created successfully"));
        })
    );

    // GET UPCOMING EVENTS (dashboard)
    app.get(
        "/event",
        AsyncHandler(async (req, res) => {
            const { search, category, from, to } = req.query;

            const { data } = await service.GetEventsWithFilters({
                search,
                category,
                from,
                to
            });

            res
                .status(200)
                .json(new ApiResponse(200, data, "Events fetched"));
        })
    );


    // UPDATE EVENT (owner only)
    app.patch(
        "/event/:id",
        UserAuth,
        upload.single("image"),
        AsyncHandler(async (req, res) => {
            const { data } = await service.UpdateEvent({
                eventId: req.params.id,
                userId: req.user._id,
                update: req.body,
                image: req?.file
            });

            res
                .status(200)
                .json(new ApiResponse(200, data, "Event updated"));
        })
    );

    // DELETE EVENT (owner only)
    app.delete(
        "/event/:id",
        UserAuth,
        AsyncHandler(async (req, res) => {
            const { data } = await service.DeleteEvent({
                eventId: req.params.id,
                userId: req.user._id
            });

            res
                .status(200)
                .json(new ApiResponse(200, data, "Event deleted"));
        })
    );
};
