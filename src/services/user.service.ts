import { buildUserResponse } from "../helpers/user.helper";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { CreateUserInput, PublicUser } from "../types/user.types";

const createUser = async (payload: CreateUserInput): Promise<PublicUser> => {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, "A user with this email already exists");
  }

  const user = await User.create({
    ...payload,
    email: payload.email.toLowerCase(),
  });

  return buildUserResponse(user);
};

const getAllUsers = async (): Promise<PublicUser[]> => {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map((user) => buildUserResponse(user));
};

const getUserById = async (userId: string): Promise<PublicUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return buildUserResponse(user);
};

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
};
