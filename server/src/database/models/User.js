import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            trim: true,
            maxlength: 128
        },
        refreshToken: {
            type: String,
            select: false
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(_, ret) {
                delete ret.password;
                delete ret.refreshToken;
                delete ret.__v;
            }
        }
    }
);

export const UserModel = mongoose.model("user", UserSchema);
