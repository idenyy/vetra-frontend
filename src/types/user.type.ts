export type User = {
  _id?: string | null;
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
  profilePic?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
