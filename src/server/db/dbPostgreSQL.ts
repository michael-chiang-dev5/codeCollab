import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.PG_URI,
});

/*
pqQuery implements functionality to run a parameterized sql query on a
postgreSQL database specified by PG_URI. Pool keeps connection open for
some period of time to assist pooling of queries. 
*/
const pgQuery = (text: string, params: any[]) => {
  // This is just to visualize the sql command being sent to the database.
  // It isn't strictly needed but is useful for debugging.
  const sqlCommand = text.replace(/\$(\d+)/g, (match, index) => {
    return typeof params[index - 1] === 'string'
      ? `\'${params[index - 1]}\'`
      : params[index - 1];
  });
  console.log('running sql command: ', sqlCommand);
  // Return the result of the sql query
  return pool.query(text, params);
};

import { MarkdownsWithMetaDataType } from '../../types/types';

const getMarkdownsWithMetadata = async () => {
  try {
    const sql = `SELECT Markdown._id,title,difficulty,str FROM Markdown
    INNER JOIN MarkdownMetadata ON MarkdownMetadata.markdown_id=Markdown._id;`;
    const data = await pgQuery(sql, []);
    const rows: MarkdownsWithMetaDataType = data.rows;
    return rows;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const getMarkdown = async (_id: number) => {
  try {
    const sql = `SELECT * 
    FROM Markdown
    WHERE Markdown._id=$1`;
    const data = await pgQuery(sql, [_id]);
    if (data.rows.length === 0) {
      return null;
    } else if (data.rows.length === 1) {
      return data.rows[0];
    } else {
      throw `db.getMarkdown: you should get 0 or 1 element when filtering by primary key`;
    }
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const getUser = async (sub: string) => {
  try {
    const sql = `SELECT * 
    FROM GoogleUserInfo
    WHERE GoogleUserInfo.sub=$1`;
    const data = await pgQuery(sql, [sub]);
    if (data.rows.length === 0) {
      return null;
    } else if (data.rows.length === 1) {
      return data.rows[0];
    } else {
      throw `db.getUser: more than one user found with sub ${sub} (found ${data.rows.length})`;
    }
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

const createUser = async (args: { [key: string]: string }) => {
  try {
    const arr = [
      args['sub'],
      args['picture'],
      args['email'],
      args['email_verified'],
    ];
    const sql = `INSERT INTO GoogleUserInfo
    (sub, picture, email, email_verified)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;
    const data = await pgQuery(sql, arr);
    console.log(data.rows);
    return data.rows[0]._id;
  } catch (err) {
    console.log('createUser', err);
  }
};

// db is an interface to interact with database
// We do it like this so it is easy to swap databases
//   pool can be used to forcibly disconnect
export const db = {
  pool,
  getUser,
  createUser,
  getMarkdown,
  getMarkdownsWithMetadata,
};
