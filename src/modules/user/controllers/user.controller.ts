import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserDto, UpdateUserDto } from "../dtos";
import { UserServiceFactory } from "../factories/user-service.factory";
import { sendReply } from "../../../shared/utils/send-response";
import { ResponseCode } from "../../../shared/types/response-code";

export class UserController {
  private readonly userService = UserServiceFactory.getInstance();

  /* GET /users/:id */
  getById = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const user = await this.userService.getUserById(req.params.id);

    return user
      ? sendReply(reply, 200, ResponseCode.OK, user)
      : sendReply(
          reply,
          404,
          ResponseCode.NOT_FOUND,
          undefined,
          "User not found"
        );
  };

  /* GET /users?username=foo&email=bar@x.com  */
  search = async (
    req: FastifyRequest<{ Querystring: { username?: string; email?: string } }>,
    res: FastifyReply
  ): Promise<FastifyReply> => {
    const { username, email } = req.query;
    let user = null;

    if (username) {
      user = await this.userService.getUserByUsername(username);
    } else if (email) {
      user = await this.userService.getUserByEmail(email);
    }

    return user
      ? sendReply(res, 200, ResponseCode.OK, user, "User found")
      : sendReply(res, 404, ResponseCode.NOT_FOUND, null, "User not found");
  };

  /* POST /users */
  create = async (
    req: FastifyRequest<{ Body: CreateUserDto }>,
    res: FastifyReply
  ): Promise<FastifyReply> => {
    const user = await this.userService.createUser(req.body);
    return sendReply(res, 201, ResponseCode.CREATED, user, "User created");
  };

  /* POST /users/:id */
  update = async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateUserDto }>,
    res: FastifyReply
  ): Promise<FastifyReply> => {
    const updatedUser = await this.userService.updateUser(
      req.params.id,
      req.body
    );
    return sendReply(res, 200, ResponseCode.OK, updatedUser, "User updated");
  };

  /* DELETE /users/:id */
  remove = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ): Promise<FastifyReply> => {
    await this.userService.deleteUser(req.params.id);
    return sendReply(res, 204, ResponseCode.NO_CONTENT, null, "User deleted");
  };
}
