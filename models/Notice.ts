// models/Notice.ts
import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  professor: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['휴강', '보강'], required: true },
});

export default mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
