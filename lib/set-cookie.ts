// pages/api/set-cookie.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end(); // Method Not Allowed
    }

    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    // Set the cookie
    res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure HTTPS in production
        sameSite: 'strict', // Change to 'lax' if necessary
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
    }));

    return res.status(200).json({ message: 'Cookie set successfully' });
}