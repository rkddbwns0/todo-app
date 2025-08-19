import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createTodo(@Body('title') title: string) {
    return await this.todoService.createTodo(title);
  }

  @Get()
  async getTodo() {
    return await this.todoService.getTodo();
  }

  @Put(':id')
  async updateTodo(@Body() id: number) {
    return await this.todoService.updateTodo(id);
  }

  @Delete(':id')
  async deleteTodo(@Body() id: number) {
    return await this.todoService.deleteTodo(id);
  }
}
