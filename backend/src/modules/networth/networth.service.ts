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


export const getNetworthCategories = async() => {
    const result = await query(
    `
    SELECT 
        nt.id AS type_id,
        nt.category_id,
        nt.type_name,
        ni.id AS institution_id,
        ni.institution_name
    FROM networth_types nt
    JOIN networth_institutions ni
        ON nt.category_id = ni.category_id
    ORDER BY nt.id, ni.id;
   `
  );
  return result.rows;
};

export const getNetworthSummary = async (userId:string): Promise<NetworthPoint[]> =>{
    const result = await query(
        `
            SELECT
            date::date AS date,
            SUM(amount) AS networth
            FROM networth_transactions
            WHERE user_id = $1
            GROUP BY date
            ORDER BY date ASC;
            `,
            [userId]
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