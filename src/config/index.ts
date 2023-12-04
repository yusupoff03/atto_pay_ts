import { config } from 'dotenv';
import * as process from 'process';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const { POSTGRES_USER, POSTGRES_URL, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_SSL } = process.env;
export const { REDIS_TLS } = process.env;
export const { CRM_API_URL, SMS_SERVICE_SECRET, CARD_SERVICE_URL, CRM_LOGIN, CRM_PASSWORD, AGGREGATOR_NAME, AGGREGATOR_SECRET } = process.env;

export const { CARD_SERVICE_USERNAME, CARD_SERVICE_PASSWORD } = process.env;
