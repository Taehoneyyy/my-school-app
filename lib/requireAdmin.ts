// lib/requireAdmin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from './authMiddleware';
import type { AuthenticatedRequest } from './authMiddleware';

export function requireAdmin(handler: (req: AuthenticatedRequest, res: NextApiResponse) => any) {
  return authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.user?.role === 'nutritionist' || req.user?.role === 'professor' || req.user?.role === 'cafemanager') {
      return handler(req, res);
    } else {
      return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    }
  });
}
