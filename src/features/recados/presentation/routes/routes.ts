import { Router } from "express";
import { EMVC, middlewareAdapter, MVCController, routerMvcAdapter} from "../../../../core/presentation";
import { CacheRepository, RecadoRepository } from "../../infra";
import { RecadoController } from "../controllers";
import { RecadoMiddleware } from "../middlewares";

const createController = (): MVCController => {
  const repository = new RecadoRepository();
  const cache = new CacheRepository();

  return new RecadoController(repository, cache);
};

export default class RecadoRoutes {
  public init(routes: Router) {
    routes.get(
      "/recados",
      routerMvcAdapter(createController(), EMVC.INDEX)
    );

    routes.get(
      "/recados/:uid",
      routerMvcAdapter(createController(), EMVC.SHOW)
    );

    routes.post(
      "/recados",
      [
        middlewareAdapter(new RecadoMiddleware()),
      ],
      routerMvcAdapter(createController(), EMVC.STORE)
    );

    routes.put(
      "/recados/:uid",
      [
        middlewareAdapter(new RecadoMiddleware()),
      ],
      routerMvcAdapter(createController(), EMVC.UPDATE)
    );

    routes.delete(
      "/recados/:uid",
      routerMvcAdapter(createController(), EMVC.DELETE)
    );
  }
}
