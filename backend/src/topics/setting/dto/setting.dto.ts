import { IsPhoneNumber } from 'class-validator';

export class UpdateSettingInputDto {
  @IsPhoneNumber()
  phone: string;

  address: string;
}
