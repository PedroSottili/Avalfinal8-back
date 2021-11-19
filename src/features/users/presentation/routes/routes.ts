import { Router } from "express";
import { EMVC, middlewareAdapter, routerAdapter, routerMvcAdapter,} from "../../../recados/presentation";
import { UserRepository } from "../../infra";
import { UserController } from "../controllers";
import { GetUserController } from "../controllers/get-user.controller";
import { UserMiddleware } from "../middlewares";

const createController = () => {
  const repository = new UserRepository();

  return new UserController(repository);
};

export default class UserRoutes {
  public init(routes: Router): void {
    routes.post(
      "/users",
      middlewareAdapter(new UserMiddleware()),
      routerMvcAdapter(createController(), EMVC.STORE)
    );
    routes.post(
      "/get",
      middlewareAdapter(new UserMiddleware()),
      routerAdapter(new GetUserController(new UserRepository()))
    );

    routes.get(
      "/users/:username",
      routerMvcAdapter(createController(), EMVC.SHOW)
    );
  }
}
