import { UserRole } from './entity/user.entity';

type PayloadType = {
  id: number;
  username: string;
  role: UserRole;
  email: string;
  icon: string | null;
};

export default PayloadType;
