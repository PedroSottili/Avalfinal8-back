import {HttpRequest, HttpResponse, MVCController, notFound, ok, serverError } from "../../../../core/presentation";
import { RecadoRepository, CacheRepository } from "../../infra";

const minuto = 60;

export class RecadoController implements MVCController {
  readonly #repository: RecadoRepository;
  readonly #cache: CacheRepository;

  constructor(repository: RecadoRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  public async index(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { usersUID } = request.body;
      const cache = await this.#cache.get(`recado:all:${usersUID}`);

      if (cache) {
        return ok({ recados: cache });
      }

      const recados = await this.#repository.getAll(usersUID);

      await this.#cache.setex(`recado:all:${usersUID}`, recados, minuto);

      return ok({ recados });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
  public async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const recado = await this.#repository.create(request.body);
      const { usersUID } = request.body;

      const recados = await this.#repository.getAll(usersUID);

      await this.#cache.setex(`recado:all:${usersUID}`, recados, minuto);

      return ok({ recado });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }

  public async show(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;
      const { usersUID } = request.body;

      const cache = await this.#cache.get(`recado:${uid}:${usersUID}`);

      if (cache) {
        return ok({ recado: cache });
      }

      const recado = await this.#repository.getOne(uid, usersUID);

      if(!recado) {
        return notFound()
      }

      await this.#cache.setex(`recado:${uid}:${usersUID}`, recado, minuto);
      return ok({ recado });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
  public async update(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;
      const { usersUID } = request.body;

      const recado = await this.#repository.update(uid, request.body);

      if (!recado) {
        return notFound();
      }

      const recados = await this.#repository.getAll(usersUID);

      await this.#cache.setex(`recado:${uid}:${usersUID}`, recado, minuto);
      await this.#cache.setex(`recado:all:${usersUID}`, recados, minuto);

      return ok({ recado });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
  public async delete(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;
      const { usersUID } = request.body;

      const recado = await this.#repository.delete(uid, usersUID);

      if (!recado) {
        return notFound();
      }

      const recados = await this.#repository.getAll(usersUID);

      await this.#cache.del(`recado:${uid}:${usersUID}`);
      await this.#cache.setex(`recado:all:${usersUID}`, recados, minuto);

      return ok({});
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}
