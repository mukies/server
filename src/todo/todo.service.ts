import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TodoList } from './schema/todo-schema';
import { Model } from 'mongoose';
import { RequestWithUser } from 'src/global-interfaces/interfaces';

@Injectable()
export class TodoService {
  constructor(@InjectModel(TodoList.name) private todo: Model<TodoList>) {}

  create(createTodoDto: CreateTodoDto, req: RequestWithUser) {
    const { description, title } = createTodoDto;
    const newTodo = new this.todo({
      title,
      description,
      createdBy: req.user,
    });

    return { message: 'New todo created', data: newTodo };
  }

  async findAll() {
    const allTodos = await this.todo.find();

    return { data: allTodos };
  }

  async findOne(id: string) {
    const todo = await this.todo.findById(id).populate('createdBy');
    return { data: todo };
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const { description, title } = updateTodoDto;

    const updatedTodo = await this.todo.findByIdAndUpdate(
      id,
      { description, title },
      { new: true },
    );

    return { message: 'Todo updated', data: updatedTodo };
  }

  async remove(id: string) {
    await this.todo.findByIdAndDelete(id);
    return { message: 'Todo has been deleted' };
  }
}
