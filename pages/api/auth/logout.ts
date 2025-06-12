// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 로그아웃은 클라이언트에서 토큰을 삭제하는 것이 핵심입니다.
  return res.status(200).json({ message: '로그아웃 처리됨. 클라이언트에서 토큰을 제거하세요.' });
}
