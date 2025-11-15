import { SetMetadata } from '@nestjs/common';

export const RolesKey = 'roles';
export const AdminOnly = () => SetMetadata(RolesKey, ['owner']);
