// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  res.status(200).json({ message: 'MongoDB 연결 성공!' });
}
