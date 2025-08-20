import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createTodo(@Body('title') title: string) {
    return await this.todoService.createTodo(title);
  }

  @Get()
  async getTodo(@Query('date') date?: Date) {
    return await this.todoService.getTodo(date);
  }

  @Put()
  async updateTodo(@Body() body: { id: number[] }) {
    const ids = body.id;
    return await this.todoService.updateTodo(ids);
  }

  @Delete()
  async deleteTodo(@Query('id') id: string) {
    const ids = id.split(',').map(Number);
    return await this.todoService.deleteTodo(ids);
  }
}
