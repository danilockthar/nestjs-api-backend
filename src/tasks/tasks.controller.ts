import { Controller, Get, Post, Delete, Param, Body, Patch, Put, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { StatusTaskDto } from './dto/status-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksServices: TasksService){}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterTasksDto: FilterTaskDto,
        @GetUser()user: User,
        ): Promise<Task[]>{
        this.logger.verbose(`Usuario ID: ${user.id} - Filtros: ${JSON.stringify(filterTasksDto)}`)
       return this.tasksServices.getTasks(filterTasksDto, user);
    }
    @Get('/:id')
    getTaskByID(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
        ): Promise<Task>{
        return this.tasksServices.getTaskByID(id, user)
    }

    @Post()
    createTask(
        @Body(ValidationPipe) createTaskDto: CreateTaskDto,
        @GetUser() user: User,
        ): Promise<Task>{
        this.logger.verbose(`User: ${user.username} creando ${JSON.stringify(createTaskDto)}`);
       return this.tasksServices.createTask(createTaskDto, user);
    }
    @Delete('/:id')
    deleteTaskByID(
        @Param('id', ParseIntPipe)id: number,
        @GetUser() user: User,
        ): Promise<object>{
        return this.tasksServices.deleteTaskByID(id, user)
    }
    @Patch('/:id')
    updateTask(
    @Param('id', ParseIntPipe) id: number, 
    @GetUser() user: User,
    @Body('status',TaskStatusValidationPipe) statusTaskDto: TaskStatus,
    @Body(ValidationPipe) createTaskDto: CreateTaskDto): Promise<Task>{
        return this.tasksServices.updateTask(id, user,statusTaskDto, createTaskDto);
    }
    // @Get()
    // getTasks(@Query(ValidationPipe) filterTasksDto: FilterTaskDto): Task[]{
    //     if(Object.keys(filterTasksDto).length){
    //         return this.tasksServices.getTaskByFilter(filterTasksDto);
    //     }else{
    //         return this.tasksServices.getAllTasks();
    //     }
    // }
    // @Get('/:id')
    // getTaskByID(@Param('id') id: string): Task{
    //     return this.tasksServices.getTaskByID(id)
    // }
}
