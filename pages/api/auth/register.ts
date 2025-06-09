// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  await connectDB();

  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '필수 입력 항목이 누락되었습니다.' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: '이미 존재하는 사용자입니다.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    role: role || 'user',
  });

  await newUser.save();

  return res.status(201).json({ message: '회원가입 성공' });
}