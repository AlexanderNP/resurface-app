import { IsNumber, Max, Min } from 'class-validator';

export default class {
  @IsNumber()
  @Min(0)
  @Max(65535)
  APP_PORT: number;
}
