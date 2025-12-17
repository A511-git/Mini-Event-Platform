import { DashboardRepository } from "../database/repository/dashboard-repository.js";
import { FormateData } from "../utils/index.js";

class DashboardService {
    constructor() {
        this.repository = new DashboardRepository();
    }

    async GetUserDashboard(userId) {
        const [created, attending] = await Promise.all([
            this.repository.GetCreatedEvents(userId),
            this.repository.GetAttendingEvents(userId)
        ]);

        return FormateData({
            createdEvents: created,
            attendingEvents: attending
        });
    }
}

export { DashboardService };
