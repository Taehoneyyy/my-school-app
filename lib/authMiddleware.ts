import type { NextApiRequest } from 'next';
import type { NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: string;
    username: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-key';

export function authMiddleware(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
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

      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
    }
  };
}
