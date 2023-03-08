import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
import { MarkdownsWithMetaDataType } from '../../types/types';
import { MarkdownType, RoomType } from '../../types/types';
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

/*
pqQuery implements functionality to run a parameterized sql query on a
postgreSQL database specified by PG_URI. Pool keeps connection open for
some period of time to assist pooling of queries. 
Returns an array of objects. Each object is a row in the database
*/
const pgQuery = async (
  text: string,
  params: any[]
): Promise<Array<{ [key: string]: any }>> => {
  // This is just to visualize the sql command being sent to the database.
  // It isn't strictly needed but is useful for debugging.
  const sqlCommand = text.replace(/\$(\d+)/g, (match, index) => {
    return typeof params[index - 1] === 'string'
      ? `\'${params[index - 1]}\'`
      : params[index - 1];
  });
  // console.log('running sql command: ', sqlCommand);
  // Return the result of the sql query
  const data = await pool.query(text, params);
  const rows = data.rows;
  return rows;
};

const getMarkdownsWithMetadata = async () => {
  const sql = `SELECT Markdown._id,title,difficulty,str FROM Markdown
    INNER JOIN MarkdownMetadata ON MarkdownMetadata.markdown_id=Markdown._id;`;
  const rows = (await pgQuery(sql, [])) as MarkdownsWithMetaDataType;
  return rows;
};

const getMarkdowns = async (_id: number) => {
  const sql = `SELECT * 
    FROM Markdown
    WHERE Markdown._id=$1`;
  const rows = (await pgQuery(sql, [_id])) as MarkdownType[];
  if (rows.length > 1)
    throw `db.getMarkdowns: you should get 0 or 1 element when filtering by primary key`;
  return rows;
};

/*
  verify is a callback in passportCreator that is called after google server access the callback url
  verify has access to user information from google and is used to sync googles auth information to local auth information
    (1) it calls getUser to see if the user already exists in our local database.
        Note that we query by the foreign key "sub"
    (2) There are 3 possibibilities:
          a: No users are found, ie, this is the first time the user has used the app
          b: One user is found, ie the user has used the app before
          c: More than one user is found ,this should not happen since sub should be a primary key for google auth
  Note that we handle errors explicitly here; this is because passport calls this function and does not have access to our global error handler
  */
import { UserType } from '../../types/types';
const getUsersBySub = async (sub: string): Promise<UserType[]> => {
  try {
    const sql = `SELECT * 
    FROM GoogleUserInfo
    WHERE GoogleUserInfo.sub=$1`;
    const rows = (await pgQuery(sql, [sub])) as UserType[];
    return rows;
  } catch (err) {
    console.log(err);
  }
};

// Note that we handle errors explicitly here; this is because passport calls this function and does not have access to our global error handler
const createUser = async (userData: UserType): Promise<UserType> => {
  try {
    const params = [
      userData.sub,
      userData.picture,
      userData.email,
      userData.email_verified,
    ];
    const sql = `INSERT INTO GoogleUserInfo
    (sub, picture, email, email_verified)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;
    const rows = await pgQuery(sql, params);
    const row = rows[0] as UserType;
    return row;
  } catch (err) {
    console.log('createUser', err);
  }
};

const insertOrUpdateRoom = async (
  roomId: string,
  countusers: number,
  title: string,
  users: string
): Promise<RoomType> => {
  try {
    const sql = `INSERT INTO Rooms (roomId, countusers, title, users)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (roomId)
    DO UPDATE SET countusers = EXCLUDED.countusers, title = EXCLUDED.title, users = EXCLUDED.users
    RETURNING *`;
    const rows = await pgQuery(sql, [roomId, countusers, title, users]);
    const row = rows[0] as RoomType;
    return row;
  } catch (err) {
    console.log('insertOrUpdateRoom', err);
  }
};

const deleteAllRooms = async (): Promise<void> => {
  try {
    const sql = `DELETE FROM Rooms;`;
    await pgQuery(sql, []);
  } catch (err) {
    console.log(err);
  }
};

const getNonemptyRooms = async () => {
  try {
    const sql = `SELECT * FROM Rooms WHERE countusers > 0;`;
    const rows = (await pgQuery(sql, [])) as RoomType[];
    return rows;
  } catch (err) {
    console.log(err);
  }
};

// db is an interface to interact with database
// We do it like this so it is easy to swap databases
//   pool can be used to forcibly disconnect
export const db = {
  pool,
  getUsersBySub,
  createUser,
  getMarkdowns,
  getMarkdownsWithMetadata,
  insertOrUpdateRoom,
  deleteAllRooms,
  getNonemptyRooms,
};
