// pages/api/admin/upload-test.ts
import type { NextApiResponse } from 'next';
import type { AuthenticatedRequest } from '@/lib/authMiddleware';
import { adminMiddleware } from '@/lib/adminMiddleware';

export default adminMiddleware(async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  return res.status(200).json({
    message: '관리자 전용 업로드 API에 접근 성공',
    user: req.user,
  });
});
