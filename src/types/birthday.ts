export type Birthday = {
  id: string;
  name: string;
  email: string;
  birthMonth: number; // 1-12
  birthDay: number; // 1-31
  birthYear?: number;
  avatarUrl?: string;
};
