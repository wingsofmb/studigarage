import { IsEmail, IsString } from 'class-validator';
import { UserRoles } from 'src/topics/user/role.enum';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class GetProdileOutputDto {
  id: number;
  email: string;
  role: UserRoles;
}
