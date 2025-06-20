export type Role = 'Super Admin' | 'Admin' | 'Manager' | 'User';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  teams: string[];
  mainStatuses: string[];
  subStatuses: string[];
  moduleAccess: Record<string, boolean>;
  avatar: string;
  createdDate: string;
  lastActive: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
}