import { IsString, MinLength } from "class-validator";

class CreateUserDto {
  @IsString()
  @MinLength(1)
  public name!: string;
}

export default CreateUserDto;
