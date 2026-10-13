import { IsString, IsNumber, Min, Max } from 'class-validator';

export default class {
  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  POSTGRES_PORT: number;
}