import { Client } from 'pg';
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_URL, POSTGRES_SSL } from '@config';

export const client = new Client({
  connectionString: `${POSTGRES_URL}`,
  ssl: POSTGRES_SSL === 'true',
});

client.connect();

export default client;
