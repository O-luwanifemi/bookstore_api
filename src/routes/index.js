import express from 'express';
import { add_book, delete_book, get_all, modify_book } from '../queries/index.js';

const router = express.Router();

// ADD BOOK : /books/add
router.post('/add', add_book);

// GET ALL BOOKS : /books
router.get('', get_all);

// EDIT BOOK : /books/modify/:id
router.patch('/modify/:id', modify_book);

// DELETE BOOK : /books/remove/:id
router.delete('/remove/:id', delete_book);

export default router;