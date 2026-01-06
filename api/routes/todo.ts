import { Router, Request } from 'express';
import jwt from 'jsonwebtoken';
import Todo from '../models/Todo';

const router = Router();

interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

// Middleware to validate JWT token
const authMiddleware = (req: AuthRequest, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; username: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Get all todos for logged-in user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const todos = await Todo.find({ userId: req.user!.id }).exec();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new todo
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, body, completed = false } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const todo = new Todo({ title, completed, userId: req.user!.id });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update existing todo
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, body, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { ...(title !== undefined && { title }), ...(completed !== undefined && { completed }) },...(body !== undefined && { body }) },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete todo
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
