import mongoose from "mongoose";
import { RSVPModel } from "../models/RSVP.js";
import { EventModel } from "../models/Event.js";
import { ApiError } from "../../utils/api-error.js";

class RSVPRepository {

    async JoinEvent({ userId, eventId }) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const event = await EventModel.findOneAndUpdate(
                { _id: eventId, availableSeats: { $gt: 0 } },
                { $inc: { availableSeats: -1 } },
                { new: true, session }
            );

            if (!event) {
                throw new ApiError(400, "Event is full");
            }
            await RSVPModel.create(
                [{ user: userId, event: eventId }],
                { session }
            );
            await session.commitTransaction();
            return true;

        } catch (error) {
            await session.abortTransaction();

            if (error.code === 11000) {
                throw new ApiError(409, "User already joined this event");
            }

            throw error;
        } finally {
            session.endSession();
        }
    }

    async LeaveEvent({ userId, eventId }) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const removed = await RSVPModel.findOneAndDelete(
                { user: userId, event: eventId },
                { session }
            );

            if (!removed) {
                throw new ApiError(404, "RSVP not found");
            }
            await EventModel.findByIdAndUpdate(
                eventId,
                { $inc: { availableSeats: 1 } },
                { session }
            );

            await session.commitTransaction();
            return true;

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

export { RSVPRepository };
