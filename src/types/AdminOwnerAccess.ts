import { SetMetadata } from '@nestjs/common';

const AdminOwnerAccess = () => SetMetadata('isAdminOwnerOnly', true);

export default AdminOwnerAccess;
