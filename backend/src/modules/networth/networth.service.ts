import { query } from '../../db_conn/db';


export interface NetworthPoint {
    date: string;      // e.g. '2025-02-25'
    networth: number;  // aggregated sum for that date
  }

export interface NetworthAllocationRow {
    month: string;   // e.g. '2025-01'
    category: string; // type_name / asset class
    amount: string;  // from SQL, we'll cast to number in frontend if needed
  }

export const createNetworthTransaction = (date: string, amount: number, typeId: number, categoryId: number, institutionId: number, userId: string) => {
    return query(
        'INSERT INTO networth_transactions (date, amount, type_id, category_id, institution_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [date, amount, typeId, categoryId, institutionId, userId]
    );
};

// List a user's networth transactions for a year (LEFT JOINs so a row still
// shows even if a lookup name is missing). type_id/category_id/institution_id
// are returned so the edit form can prefill the selector.
export const getNetworthTable = (userId: string, year: number) => {
    return query(
      `SELECT
        t.id,
        to_char(t.date, 'YYYY-MM-DD') AS date,
        t.amount,
        nt.type_name AS type,
        t.type_id,
        nc.category_name AS category,
        t.category_id,
        ni.institution_name AS institution,
        t.institution_id
      FROM networth_transactions t
      LEFT JOIN networth_types nt ON nt.id = t.type_id
      LEFT JOIN networth_categories nc ON nc.id = t.category_id
      LEFT JOIN networth_institutions ni ON ni.id = t.institution_id
      WHERE t.user_id = $1
        AND t.date >= make_date($2, 1, 1)
        AND t.date <  make_date($2 + 1, 1, 1)
      ORDER BY t.date DESC`,
      [userId, year]
    );
};

// Scoped by user_id so a user can only update their own networth transactions.
export const updateNetworthTransaction = (id: number, date: string, amount: number, typeId: number, categoryId: number, institutionId: number, userId: string) => {
    return query(
        `UPDATE networth_transactions
         SET date = $1, amount = $2, type_id = $3, category_id = $4, institution_id = $5
         WHERE id = $6 AND user_id = $7
         RETURNING *`,
        [date, amount, typeId, categoryId, institutionId, id, userId]
    );
};

// Scoped by user_id so a user can only delete their own networth transactions.
export const deleteNetworthTransaction = (id: number, userId: string) => {
    return query(
        'DELETE FROM networth_transactions WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
    );
};


export const getNetworthCategories = async() => {
    const result = await query(
    `
    SELECT 
        nt.id          AS type_id,
        nt.type_name,
        nt.category_id,
        ni.id          AS institution_id,
        ni.institution_name
    FROM networth_types nt
    JOIN networth_institutions ni
    ON nt.id = ni.type_id     
    ORDER BY nt.category_id, nt.id, ni.id;
   `
  );
  return result.rows;
};

export const getNetworthSummary = async (userId:string, year:number): Promise<NetworthPoint[]> =>{
    const result = await query(
        `
            SELECT
            date::date AS date,
            SUM(amount) AS networth
            FROM networth_transactions
            WHERE user_id = $1
            AND date >= make_date($2, 1, 1)
            AND date <  make_date($2 + 1, 1, 1)
            GROUP BY date
            ORDER BY date ASC;
            `,
            [userId, year]
    );
    return result.rows.map((row) => ({
        date: row.date,
        networth: Number(row.networth),
    }));
};

export const getNetworthAllocationForYear = async (userId: string,year: number): Promise<NetworthAllocationRow[]> => {
        const result = await query(
          `
          SELECT
            to_char(t.date, 'YYYY-MM') AS month,
            nt.type_name AS category,
            SUM(t.amount) AS amount
          FROM networth_transactions t
          JOIN networth_types nt ON t.type_id = nt.id
          WHERE t.user_id = $1
            AND t.date >= make_date($2, 1, 1)
            AND t.date <  make_date($2 + 1, 1, 1)
          GROUP BY month, nt.type_name
          ORDER BY month, nt.type_name;
          `,
          [userId, year]
        );
        return result.rows;
      };

