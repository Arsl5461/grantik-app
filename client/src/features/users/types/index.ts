import { BaseEntity } from '../../../types';

export type User = {
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  bio: string;
} & BaseEntity;
