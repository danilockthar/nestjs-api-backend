import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<Object> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken : string}>{

        const username = await this.userRepository.validatePasswordUser(authCredentialsDto);
        
        if(!username){
            throw new UnauthorizedException('Credenciales inválidas');
        }
        // else{
        //     return username;
        // }
        const payload :JwtPayload = {username};
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`JWT generado con el siguiente payload: ${JSON.stringify(payload)}`);
        return {accessToken}
    }

}
