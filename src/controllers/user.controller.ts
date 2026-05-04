import { Request, Response } from "express";

import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export const createUser = asyncHandler(async (request: Request, response: Response) => {
  const user = await userService.createUser(request.body);

  sendSuccess(response, {
    statusCode: 201,
    message: "User created successfully",
    data: user,
  });
});

export const getAllUsers = asyncHandler(async (_request: Request, response: Response) => {
  const users = await userService.getAllUsers();

  sendSuccess(response, {
    statusCode: 200,
    message: "Users fetched successfully",
    data: users,
  });
});

export const getUserById = asyncHandler(async (request: Request, response: Response) => {
  const user = await userService.getUserById(request.params.userId);

  sendSuccess(response, {
    statusCode: 200,
    message: "User fetched successfully",
    data: user,
  });
});
