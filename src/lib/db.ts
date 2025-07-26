import pg from 'pg';

const { Pool } = pg;

const connectionString = import.meta.env.DATABASE_URL;

export const db = new Pool({
  connectionString,
});
