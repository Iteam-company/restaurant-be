import { SetMetadata } from '@nestjs/common';

const AdminAccess = () => SetMetadata('isAdminOnly', true);

export default AdminAccess;
