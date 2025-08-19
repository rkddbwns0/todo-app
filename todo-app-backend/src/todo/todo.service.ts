import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import todoEntity from 'src/entities/todo.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(todoEntity)
    private readonly todo: Repository<todoEntity>,
  ) {}

  async createTodo(title: string) {
    try {
      const todo = await this.todo.create({ title });
      return await this.todo.save(todo);
    } catch (e) {
      console.error(e);
    }
  }

  async getTodo() {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 59);
      const todoList = await this.todo.find({
        where: { created_at: Between(start, end) },
      });
      return todoList;
    } catch (e) {
      console.error(e);
    }
  }

  async updateTodo(id: number) {
    try {
      const todo = await this.todo.findOne({ where: { id: id } });
      if (todo?.completed === false) {
        await this.todo.update(id, { completed: true });
      } else {
        await this.todo.update(id, { completed: false });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async deleteTodo(id: number) {
    try {
      await this.todo.delete(id);
    } catch (e) {
      console.error(e);
    }
  }
}
