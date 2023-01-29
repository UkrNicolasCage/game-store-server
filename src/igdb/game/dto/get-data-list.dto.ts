import { IsInt, Max, Min } from 'class-validator';
export class getDataListDto {
  @IsInt()
  @Max(30)
  @Min(1)
  readonly limit: number = 10;

  @IsInt()
  @Min(0)
  readonly offset: number = 0;
}
