import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { create } from 'domain';
import { FilterTaskDto } from './dto/filter-task.dto';
import { StatusTaskDto } from './dto/status-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    async getTasks(
        filterTaskDto: FilterTaskDto,
        user: User
        ): Promise<Task[]> {
        return this.taskRepository.getTasks(filterTaskDto, user)
    }

    async getTaskByID(
        id: number,
        user: User,
        ): Promise<Task>{
        const found = await this.taskRepository.findOne({where: {id, userId: user.id}});
        if(!found){
            throw new NotFoundException('No se han encontrado resultados para ese ID.')
        }
        return found;
    }   

    createTask(
        createTaskDto: CreateTaskDto,
        user: User,
        ): Promise<Task>{
        return this.taskRepository.createTask(createTaskDto, user)
    }

    async deleteTaskByID(
        id: number,
        user: User,
        ): Promise<object> {
        const result = await this.taskRepository.delete({id, userId: user.id});
        if(result.affected === 0){
            throw new NotFoundException('No se han encontrado resultados para ese ID.')
        }
        let response = {success: true, message: 'Se ha eliminado correctamente'}
        return response;
    }

    async updateTask(
        id:number,
        user: User,
        status:TaskStatus,
        createTaskDto: CreateTaskDto
        ):Promise<Task>{
        console.log(status, 'el status es:')
        const task = await this.getTaskByID(id, user);
        const {title, description} = createTaskDto;
        task.status = status;
        task.title = title;
        task.description = description;
        await task.save();
        return task
    }


    // private tasks: Task[] = [];

    // getAllTasks(): Task[]{
    //     return this.tasks;
    // }
    // getTaskByFilter(filterDto: FilterTaskDto): Task[]{
    //     const {status, search} = filterDto;
    //     let tasks = this.getAllTasks();
    //     if(status){
    //         tasks = tasks.filter(task => task.status === status)
    //     }
    //     if(search){
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) ||
    //             task.description.includes(search)
    //         )
    //     }
    //     return tasks
    // }

    // getTaskByID(id: string): Task{
    //     const found = this.tasks.find(task => task.id === id)
    //     if(!found){
    //        throw new NotFoundException('No se han encontrado resultados para ese ID.')
    //     }
    //     return found;
    // }
    // deleteTaskByID(id: string): string {
    //     const found = this.getTaskByID(id)
    //     this.tasks = this.tasks.filter(task => task.id !== found.id);
    //     return 'Tarea eliminada correctamente';
    // }

    // updateTask(id:string, statusTaskDto:StatusTaskDto ,createTaskDto: CreateTaskDto): Task{
    //     const {status} = statusTaskDto;
    //     const {title, description} = createTaskDto
    //     const task = this.getTaskByID(id);
    //     task.title = title;
    //     task.description = description;
    //     task.status = status;
    //     return task;
    // }
}
