import { query } from '../../db_conn/db';
import bcrypt from 'bcryptjs';

export const createUser = async (email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [email, hashedPassword]
    );
    return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
}; 

// Only the SHA-256 of the MCP token is stored; overwriting it revokes the previous token.
export const setMcpTokenHash = async (userId: string, tokenHash: string) => {
    await query('UPDATE users SET mcp_token_hash = $1 WHERE id = $2', [tokenHash, userId]);
};

export const findUserIdByMcpTokenHash = async (tokenHash: string): Promise<string | undefined> => {
    const result = await query('SELECT id FROM users WHERE mcp_token_hash = $1', [tokenHash]);
    return result.rows[0] ? String(result.rows[0].id) : undefined;
};
