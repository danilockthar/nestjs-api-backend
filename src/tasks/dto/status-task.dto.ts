import { IsIn, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task-status-enum";

export class StatusTaskDto {
    @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
    @IsNotEmpty()
    status: TaskStatus
}