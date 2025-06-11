// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      role: string;
    };

    return res.status(200).json({
      message: '사용자 인증 성공',
      user: {
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }
}
