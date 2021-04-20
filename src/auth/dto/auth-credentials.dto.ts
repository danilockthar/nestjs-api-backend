import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4, {message: 'El nombre de usuario debe contener al menos 4 caracteres.'})
    @MaxLength(20)
    username: string;
    @IsString()
    @MinLength(8, {message: 'La contraseña debe ser superior a 8 caracteres.'})
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    password:string;
}