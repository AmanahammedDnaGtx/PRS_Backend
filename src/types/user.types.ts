import { HydratedDocument } from "mongoose";

export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDocument = HydratedDocument<IUser>;
