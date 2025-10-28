export type PersonStatus = 'active' | 'guest' | 'new' | 'leader';

export type Person = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: PersonStatus;
  tags: string[];
};
