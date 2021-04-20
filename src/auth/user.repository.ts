import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<Object>{

        const {username, password} = authCredentialsDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        
        try {
            await user.save();
            if(user.username){
                return {
                    success:true,
                    msg: 'Usuario creado exitosamente',
                }
            }
        } catch (error) {
            if(error.code === '23505'){// duplicate error code
                throw new ConflictException('Este usuario ya existe.');
            } else{
                throw new InternalServerErrorException();
            }
        }
        
    }

    async validatePasswordUser(authCredentialsDto: AuthCredentialsDto):Promise<string> {
        
        const {username, password} = authCredentialsDto;
        const user = await this.findOne({username});

        if(user && await user.validatePassword(password)){
            return user.username
        }else{
            return null
        }
    }

    private async hashPassword(password: string, salt:string):Promise<string> {
        return bcrypt.hash(password, salt);
    }
}