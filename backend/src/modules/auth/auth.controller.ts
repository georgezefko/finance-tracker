import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import * as authService from './auth.service';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const signToken = (userId: number, email: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set in environment variables.');
    }
    return jwt.sign({ userId, email }, secret, { expiresIn: '1h' });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = userSchema.parse(req.body);

        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const user = await authService.createUser(email, password);

        // Issue a token immediately so the client can log the user in without
        // forcing a second, redundant manual login.
        const token = signToken(user.id, user.email);
        return res
            .status(201)
            .json({ message: 'User created successfully!', token, userId: user.id });

    } catch (error) {
        next(error);
        return;
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = userSchema.parse(req.body);

        const user = await authService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isEqual = await bcrypt.compare(password, user.password_hash);
        if (!isEqual) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = signToken(user.id, user.email);

        return res.status(200).json({ token, userId: user.id });
        
    } catch (error) {
        next(error);
        return;
    }
}; 