import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import todoEntity from 'src/entities/todo.entity';
import { Between, In, Like, Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(todoEntity)
    private readonly todo: Repository<todoEntity>,
  ) {}

  async createTodo(title: string) {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 59);

      const todoList = await this.todo.find({
        where: { created_at: Between(start, end) },
      });

      if (todoList.length >= 10) {
        throw new HttpException(
          'Todo List는 하루에 10개까지 등록이 가능합니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const todo = await this.todo.create({ title });
      return await this.todo.save(todo);
    } catch (e) {
      console.error(e);
      if (e instanceof HttpException) throw e;
    }
  }

  async getTodo(date?: Date) {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 59);

      if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 59);

        const todoList = await this.todo.find({
          where: { created_at: Between(start, end) },
          order: { completed: 'desc', created_at: 'asc' },
        });
        return todoList;
      }
      const todoList = await this.todo.find({
        where: { created_at: Between(start, end) },
        order: { completed: 'desc', created_at: 'asc' },
      });
      return todoList;
    } catch (e) {
      console.error(e);
    }
  }

  async updateTodo(id: number[]) {
    try {
      const todo = await this.todo.find({ where: { id: In(id) } });
      const todoMap = todo.map((item) => ({
        id: item.id,
        completed: item.completed,
      }));
      for (let i = 0; i < todoMap.length; i++) {
        if (todoMap[i].completed === true) {
          todoMap[i].completed = false;
          await this.todo.update(todoMap[i].id, todoMap[i]);
        } else {
          todoMap[i].completed = true;
          await this.todo.update(todoMap[i].id, todoMap[i]);
        }
      }
      return;
    } catch (e) {
      console.error(e);
    }
  }

  async deleteTodo(id: number[]) {
    try {
      await this.todo.delete(id);
    } catch (e) {
      console.error(e);
    }
  }
}
