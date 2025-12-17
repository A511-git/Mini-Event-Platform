import { EventModel } from "../../database/models/index.js";
import { ApiError } from "../../utils/api-error.js";

class EventRepository {

    async CreateEvent(eventData) {
        try {
            eventData.availableSeats = eventData.capacity;
            const event = new EventModel(eventData);
            return await event.save();
        } catch {
            throw new ApiError(500, "Unable to create event");
        }
    }

    // async FindUpcomingEvents() {
    //     try {
    //         return await EventModel.find({
    //             dateTime: { $gte: new Date() }
    //         }).sort({ dateTime: 1 });
    //     } catch {
    //         throw new ApiError(500, "Unable to fetch events");
    //     }
    // }

    async FindEventsWithFilters({ search, category, from, to }) {
        try {
            const query = {};
            if (search) {
                query.title = { $regex: search, $options: "i" };
            }
            if (category) {
                query.category = category.toLowerCase();
            }
            if (from || to) {
                query.dateTime = {};
                if (from) query.dateTime.$gte = new Date(from);
                if (to) query.dateTime.$lte = new Date(to);
            }

            return await EventModel.find(query).sort({ dateTime: 1 });
        } catch {
            throw new ApiError(500, "Unable to fetch events");
        }
    }


    async FindEventById(id) {
        try {
            return await EventModel.findById(id);
        } catch {
            throw new ApiError(404, "Event not found");
        }
    }

    async UpdateEvent({ eventId, userId, update }) {
        try {
            const event = await EventModel.findOneAndUpdate(
                { _id: eventId, createdBy: userId },
                update,
                { new: true }
            );

            if (!event)
                throw new ApiError(403, "Not allowed to update this event");

            return event;
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new ApiError(500, "Unable to update event");
        }
    }

    async DeleteEvent({ eventId, userId }) {
        try {
            const event = await EventModel.findOneAndDelete({
                _id: eventId,
                createdBy: userId
            });

            if (!event)
                throw new ApiError(403, "Not allowed to delete this event");

            return true;
        } catch (err) {
            if (err instanceof ApiError) throw err;
            throw new ApiError(500, "Unable to delete event");
        }
    }
}

export { EventRepository };
