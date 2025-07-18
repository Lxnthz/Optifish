import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,

  typeCast: function (field, next) {
    if (field.type === "NEWDECIMAL" || field.type === "LONGLONG") {
      const val = field.string();
      return val === null ? null : val;
    }
    return next();
  },
})

export default pool;