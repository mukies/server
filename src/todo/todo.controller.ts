import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RequestWithUser } from 'src/global-interfaces/interfaces';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Body(ValidationPipe) createTodoDto: CreateTodoDto,
    @Request() req: RequestWithUser,
  ) {
    return this.todoService.create(createTodoDto, req);
  }

  @Get('all')
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }
}
