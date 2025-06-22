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
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
    } catch (err) {
        res.status(500).json({ message: 'Token verification failed.' });
        return;
    }
    if (!decodedToken || typeof decodedToken !== 'object') {
        res.status(401).json({ message: 'Not authenticated.' });
        return;
    }
    req.userId = decodedToken.userId;
    next();
    return;
}; 