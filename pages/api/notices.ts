import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import Notice from '@/models/Notice';
import { authMiddleware, AuthenticatedRequest } from '@/lib/authMiddleware';
import { requireAdmin } from '@/lib/requireAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    // ✅ 인증 없이 누구나 접근 가능
    try {
      const data = await Notice.find().sort({ date: 1 });
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: "불러오기 실패", error: err });
    }
  }

  // ✅ POST, DELETE는 인증 + 관리자만
  const adminOnlyHandler = requireAdmin(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const result = await Notice.create(req.body);
        return res.status(201).json(result);
      } catch (err) {
        return res.status(500).json({ message: "등록 실패", error: err });
      }
    }

    if (req.method === 'DELETE') {
      try {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ message: "삭제할 ID가 필요합니다." });
        }

        await Notice.findByIdAndDelete(id);
        return res.status(200).json({ message: "삭제 완료" });
      } catch (err) {
        return res.status(500).json({ message: "삭제 실패", error: err });
      }
    }

    // 허용되지 않은 메서드
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  });

  return authMiddleware(adminOnlyHandler)(req as AuthenticatedRequest, res);
}
