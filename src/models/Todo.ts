import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
}

const TodoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
export default Todo;
