import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import * as feedService from '../cashflow/cashflow.service';
import * as networthService from '../networth/networth.service';
import * as authService from '../auth/auth.service';
import { hashMcpToken } from '../auth/auth.controller';

interface McpRequest extends Request {
    userId?: string;
}

// Bearer <MCP token> → req.userId. Separate from is-auth because MCP clients
// hold a long-lived token, not the 1h login JWT.
const mcpAuth = async (req: McpRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.get('Authorization')?.split(' ')[1];
        const userId = token && await authService.findUserIdByMcpTokenHash(hashMcpToken(token));
        if (!userId) {
            res.status(401).json({ message: 'Invalid or missing MCP token.' });
            return;
        }
        req.userId = userId;
        next();
    } catch (error) {
        next(error);
    }
};

const year = { year: z.number().int().describe('Calendar year, e.g. 2025. Use list_years to see which exist.') };
const AMOUNTS = 'Amounts are in DKK.';

// Every tool closes over the authenticated userId, so the model can only read
// the caller's own data — it never sees or chooses user_id.
const buildServer = (userId: string) => {
    const server = new McpServer({ name: 'finance-tracker', version: '1.0.0' });
    const json = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data) }] });

    server.registerTool('list_years', {
        description: 'Years that have cashflow transactions, newest first.',
    }, async () => json((await feedService.getAvailableYears(userId)).rows));

    server.registerTool('get_financial_overview', {
        description: `Headline metrics for a year: total income, net income, cumulative net income, savings rate (%), and each expense category as a % of income. ${AMOUNTS}`,
        inputSchema: year,
    }, async ({ year }) => json((await feedService.getFinancialOverview(userId, year)).rows));

    server.registerTool('get_income_expenses', {
        description: `Monthly income vs expenses for a year. ${AMOUNTS}`,
        inputSchema: year,
    }, async ({ year }) => json((await feedService.getIncomeExpenses(userId, year)).rows));

    server.registerTool('get_spending_by_category', {
        description: `Spending per month (YYYY-MM) per category for a year, income excluded. ${AMOUNTS}`,
        inputSchema: year,
    }, async ({ year }) => json((await feedService.getFinancialDetails(userId, year)).rows));

    server.registerTool('get_cashflow', {
        description: `Totals per category, type and month for a year, including income. ${AMOUNTS}`,
        inputSchema: year,
    }, async ({ year }) => json((await feedService.getCasflow(userId, year)).rows));

    server.registerTool('list_expenses', {
        description: `Every expense transaction in a year (date, amount, type, category), newest first. ${AMOUNTS}`,
        inputSchema: year,
    }, async ({ year }) => json((await feedService.getExpenseTable(userId, year)).rows));

    server.registerTool('get_networth_history', {
        description: `Total net worth at each recorded date in a year. ${AMOUNTS}`,
        inputSchema: year,
    }, async ({ year }) => json(await networthService.getNetworthSummary(userId, year)));

    server.registerTool('get_networth_allocation', {
        description: `Net worth per month split by asset type for a year. ${AMOUNTS}`,
        inputSchema: year,
    }, async ({ year }) => json(await networthService.getNetworthAllocationForYear(userId, year)));

    return server;
};

const router = express.Router();

// ponytail: stateless — a fresh server per request, no sessions. Add session
// handling only if a tool ever needs server-initiated messages.
router.post('/', mcpAuth, async (req: McpRequest, res: Response, next: NextFunction) => {
    try {
        const server = buildServer(req.userId!);
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
        res.on('close', () => {
            transport.close();
            server.close();
        });
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        next(error);
    }
});

// No sessions, so no SSE stream (GET) or session teardown (DELETE).
router.all('/', (_req, res) => {
    res.status(405).json({ message: 'Method not allowed.' });
});

export default router;
