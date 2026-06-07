import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export default (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).json({ message: 'Not authenticated.' });
        return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // Server misconfiguration is a genuine 500 — not an auth failure.
        res.status(500).json({ message: 'JWT_SECRET is not set in environment variables.' });
        return;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, secret);
    } catch (err) {
        // An expired or otherwise invalid token is an authentication failure (401),
        // not a server error (500). The client uses 401/403 to trigger a clean logout.
        res.status(401).json({ message: 'Session expired. Please log in again.' });
        return;
    }
    if (!decodedToken || typeof decodedToken !== 'object') {
        res.status(401).json({ message: 'Not authenticated.' });
        return;
    }
    req.userId = (decodedToken as { userId: string }).userId;
    next();
    return;
}; 