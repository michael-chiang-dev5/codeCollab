import express from 'express';
export const router = express.Router();
import { db } from './db/dbPostgreSQL';

router.get('/markdown/:id', async (req, res) => {
  const _id = Number(req.params.id);
  const row = await db.getMarkdown(_id);
  res.status(200).send(row);
});
