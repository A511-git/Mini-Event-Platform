import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        dateTime: {
            type: Date,
            required: true,
            index: true
        },
        location: {
            type: String,
            required: true
        },
        capacity: {
            type: Number,
            required: true,
            min: 1
        },
        availableSeats: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

export const EventModel = mongoose.model("event", EventSchema);
