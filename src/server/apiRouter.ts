import express from 'express';
export const router = express.Router();
import { db } from './db/dbPostgreSQL';
import { ErrorType } from '../types/types';

// This returns a list of all markdowns with their associated metadata
router.get('/markdown/library', async (req, res, next) => {
  try {
    const rows = await db.getMarkdownsWithMetadata();
    return res.status(200).send(rows);
  } catch (err) {
    const errObj: ErrorType = {
      message: err,
      status: 500,
      location: '/api/markdown/library',
    };
    return next(errObj);
  }
});

router.get('/markdown/:id', async (req, res, next) => {
  try {
    const _id = Number(req.params.id);
    const row = await db.getMarkdown(_id);
    return res.status(200).send(row);
  } catch (err) {
    const errObj: ErrorType = {
      message: err,
      status: 500,
      location: '/api/markdown/:id',
    };
    return next(errObj);
  }
});
