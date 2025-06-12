// lib/adminMiddleware.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware, AuthenticatedRequest } from './authMiddleware';

export function adminMiddleware(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => void
) {
  return authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.user?.role !== 'cafemanager' && req.user?.role !== 'nutritionist' && req.user?.role !== 'professor') {
      return res.status(403).json({ message: '관리자 권한이 없습니다.' });
    }
    return handler(req, res);
  });
}
