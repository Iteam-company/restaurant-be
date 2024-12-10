import CreateUserDto from './dto/create-user.dto';

type UserType = { id: number } & CreateUserDto;

export default UserType;
