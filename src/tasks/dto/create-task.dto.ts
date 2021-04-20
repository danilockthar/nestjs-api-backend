import {IsNotEmpty} from 'class-validator'

export class CreateTaskDto {
    @IsNotEmpty({message: 'El título no puede quedar vacío'})
    title: string;
    @IsNotEmpty({message: 'La descripción no puede quedar vacía'})
    description: string;
}