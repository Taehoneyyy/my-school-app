// pages/api/admin/test.ts
import type { NextApiResponse } from 'next';
import type { AuthenticatedRequest } from '@/lib/authMiddleware';
import { requireAdmin } from '@/lib/requireAdmin';

export default requireAdmin(async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  return res.status(200).json({
    message: '관리자 권한으로 성공한 API입니다.',
    user: req.user,
  });
});
