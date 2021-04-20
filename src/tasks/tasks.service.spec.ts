import {Test} from '@nestjs/testing';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status-enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = {username: 'Dani'};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
});

describe('TasksService', ()=> { 
    let tasksService;
    let taskRepository;

    beforeEach(async()=> {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TaskRepository, useFactory: mockTaskRepository}
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository)
    });

    describe('getTasks', () => {
        it('Get tasks from the repository', async ()=> {
            taskRepository.getTasks.mockResolvedValue('SomeValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: FilterTaskDto = {status: TaskStatus.IN_PROGRESS, search: 'Some search'}
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('SomeValue');
        });
    });

})