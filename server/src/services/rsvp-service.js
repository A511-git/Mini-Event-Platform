import { RSVPRepository } from "../database/repository/rsvp-repository.js";
import { FormateData } from "../utils/index.js";

class RSVPService {
    constructor() {
        this.repository = new RSVPRepository();
    }

    async JoinEvent({ userId, eventId }) {
        await this.repository.JoinEvent({ userId, eventId });
        return FormateData(true);
    }

    async LeaveEvent({ userId, eventId }) {
        await this.repository.LeaveEvent({ userId, eventId });
        return FormateData(true);
    }
}

export { RSVPService };
