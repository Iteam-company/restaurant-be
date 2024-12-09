import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import PayloadType from 'src/types/PayloadType';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(payload: PayloadType) {
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
