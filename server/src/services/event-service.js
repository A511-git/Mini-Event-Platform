import { EventRepository } from "../database/repository/event-repository.js";
import { FormateData } from "../utils/index.js";
import { CloudinaryUpload } from "../utils/cloudinary.js";
import { ApiError } from "../utils/api-error.js";


class EventService {
    constructor() {
        this.repository = new EventRepository();
    }

    async CreateEvent({ userId, eventData, image }) {
        if (!image) throw new ApiError(400, "Image is required");

        const url = await CloudinaryUpload(image);
        if (!url ||!url.secure_url) throw new ApiError(500, "Unable to upload image");
        eventData.imageUrl = url.secure_url;

        const event = await this.repository.CreateEvent({
            ...eventData,
            createdBy: userId
        });

        return FormateData(event);
    }

    async GetUpcomingEvents() {
        const events = await this.repository.FindUpcomingEvents();
        return FormateData(events);
    }

    async UpdateEvent({ eventId, userId, update, image }) {
        if (image) {
            const url = await CloudinaryUpload(image);
            if (!url.secure_url) throw new ApiError(500, "Unable to upload image");
            update.imageUrl = url.secure_url;
        }
        const event = await this.repository.UpdateEvent({
            eventId,
            userId,
            update
        });

        return FormateData(event);
    }

    async DeleteEvent({ eventId, userId }) {
        await this.repository.DeleteEvent({ eventId, userId });
        return FormateData(true);
    }

    async GetEventsWithFilters(filters) {
        const events = await this.repository.FindEventsWithFilters(filters);
        return FormateData(events);
    }

}

export { EventService };
