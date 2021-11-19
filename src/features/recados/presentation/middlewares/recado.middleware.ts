import {badRequest, HttpRequest, HttpResponse, ok, RequireFieldsValidator} from "../../../../core/presentation";
import { Recado } from "../../domain";

export class RecadoMiddleware {
  private linhas = ["descricao", "detalhamento"];

  public handle(request: HttpRequest): HttpResponse {
    const body: Recado = request.body;

    for (const linha of this.linhas) {
      const error = new RequireFieldsValidator(linha).validate(body);

      if (error) {
        return badRequest(error);
      }
    }

    return ok({});
  }
}
