import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
