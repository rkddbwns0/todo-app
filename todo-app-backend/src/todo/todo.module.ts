import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import todoEntity from 'src/entities/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([todoEntity])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
