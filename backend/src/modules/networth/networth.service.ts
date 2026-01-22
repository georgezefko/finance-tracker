import { query } from '../../db_conn/db';


export const createNetworthTransaction = (date: string, amount: number, typeId: number, categoryId: number, institutionId: number, userId: string) => {
    return query(
        'INSERT INTO transactions (date, amount, type_id, category_id, institution_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [date, amount, typeId, categoryId, institutionId, userId]
    );
};