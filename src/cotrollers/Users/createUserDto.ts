import { IsString } from "class-validator";

class CreateUserDto {
  @IsString()
  public name!: string;
}

export default CreateUserDto;
