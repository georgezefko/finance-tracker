import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import * as authService from '../services/auth.service';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = userSchema.parse(req.body);

        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const user = await authService.createUser(email, password);
        return res.status(201).json({ message: 'User created successfully!', user });

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

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not set in environment variables.');
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            secret,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ token, userId: user.id });
        
    } catch (error) {
        next(error);
        return;
    }
}; 