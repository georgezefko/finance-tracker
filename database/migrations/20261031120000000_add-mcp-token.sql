-- Up Migration

-- ponytail: one MCP token per user (regenerating revokes the old one); a tokens table if users need several.
ALTER TABLE users ADD COLUMN IF NOT EXISTS mcp_token_hash CHAR(64) UNIQUE;

-- Down Migration

ALTER TABLE users DROP COLUMN IF EXISTS mcp_token_hash;
