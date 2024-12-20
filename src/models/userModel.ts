import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    name: string;
    username: string;
    phoneNumber?: number;
    password?: string;

}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please use a valid email address'] },
    name: { type: String },
    username: { type: String, required: true, trim: true, unique: true },
    phoneNumber: { type: Number },
    password: { type: String },
})

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;