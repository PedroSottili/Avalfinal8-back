import { badRequest, HttpRequest, HttpResponse, ok, RequireFieldsValidator} from "../../../recados/presentation";
import { User } from "../../domain";

export class UserMiddleware {
  private linhas = ["username", "password"];

  public handle(request: HttpRequest): HttpResponse {
    const body: User = request.body;

    for (const linha of this.linhas) {
      const error = new RequireFieldsValidator(linha).validate(body);

      if (error) {
        return badRequest(error);
      }
    }

    return ok({});
  }
}
