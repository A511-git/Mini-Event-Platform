import { EventModel } from "../models/Event.js";
import { RSVPModel } from "../models/RSVP.js";
import { ApiError } from "../../utils/api-error.js";

class DashboardRepository {

    async GetCreatedEvents(userId) {
        try {
            return await EventModel.find({ createdBy: userId })
                .sort({ dateTime: 1 });
        } catch {
            throw new ApiError(500, "Unable to fetch created events");
        }
    }

    async GetAttendingEvents(userId) {
        try {
            const rsvps = await RSVPModel.find({ user: userId })
                .populate("event");

            return rsvps.map(rsvp => rsvp.event);
        } catch {
            throw new ApiError(500, "Unable to fetch attending events");
        }
    }
}

export { DashboardRepository };
