import { Pool } from 'pg';

export const dbPool = new Pool({
  user: process.env.DB_USER || 'admin_ceregati',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ceregati_logistics_db',
  password: process.env.DB_PASSWORD || 'SecretPassword123!',
  port: Number(process.env.DB_PORT) || 5432,
});