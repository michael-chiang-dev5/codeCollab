import express from 'express';
export const router = express.Router();
import { db } from './db/dbPostgreSQL';
import { ErrorType } from '../types/types';

// This returns a list of all markdowns with their associated metadata
router.get('/markdown/all', async (req, res, next) => {
  try {
    const rows = await db.getMarkdownsWithMetadata();
    return res.status(200).json(rows);
  } catch (err) {
    const errObj: ErrorType = {
      message: err,
      status: 500,
      location: '/api/markdown/all',
    };
    return next(errObj);
  }
});

router.get('/markdown/:id', async (req, res, next) => {
  try {
    const _id = Number(req.params.id);
    const rows = await db.getMarkdowns(_id);
    if (rows.length === 0) throw 'markdown id not found in database';
    return res.status(200).json(rows);
  } catch (err) {
    const errObj: ErrorType = {
      message: err,
      status: 500,
      location: '/api/markdown/:id',
    };
    return next(errObj);
  }
});
