import mongoose from "mongoose";

const RSVPSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "event",
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);
RSVPSchema.index({ user: 1, event: 1 }, { unique: true });

export const RSVPModel = mongoose.model("rsvp", RSVPSchema);
