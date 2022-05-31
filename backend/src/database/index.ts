import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const {Client} = pg;

const client = new Client({connectionString:process.env.DATABASE_URL})

export default client;