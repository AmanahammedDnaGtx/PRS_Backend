import { UserDocument } from "../types/user.types";
import { PublicUser } from "../types/user.types";

export const buildUserDisplayName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

export const buildUserResponse = (user: UserDocument): PublicUser => {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: buildUserDisplayName(user.firstName, user.lastName),
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
