import express from 'express';
export const router = express.Router();
import { db } from './db/dbPostgreSQL';

// This returns a list of all markdowns with their associated metadata
router.get('/markdown/library', async (req, res) => {
  const rows = await db.getMarkdownsWithMetadata();
  console.log(rows);
  res.status(200).send(rows);
  // res.status(200).send([{ a: 'b' }]);
});

router.get('/markdown/:id', async (req, res) => {
  const _id = Number(req.params.id);
  const row = await db.getMarkdown(_id);
  res.status(200).send(row);
});
