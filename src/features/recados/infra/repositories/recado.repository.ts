import { RecadoEntity } from "../../../../core/infra";
import { Recado } from "../../domain";

export class RecadoRepository {
  
  async create(params: Recado): Promise<Recado> {
    const { descricao, detalhamento, usersUID } = params;

    const recado = await RecadoEntity.create({descricao, detalhamento, usersUID}).save();

    return Object.assign({} as Recado, params, recado);
  }

  async getAll(): Promise<Recado | any |[]> {
    const recados = await RecadoEntity.find({
      relations: ["user"],
      order: { createdAt: "DESC" }
    });

    return recados.map((recado: { user: any; }) => ({
      ...recado,
      user: recado.user,
    }));
  }

  async getOne(uid: string): Promise<Recado | any> {
    const recado = await RecadoEntity.findOne(uid, {
      relations: ["user"]
    });

    if (!recado) {
      return null;
    }

    return {
      ...recado,
      user: recado.user,
    };
  }

  async update(uid: string, params: Recado): Promise<Recado | any> {
    const { descricao, detalhamento, usersUID } = params;

    const recado = await RecadoEntity.findOne(uid, {
      where: { usersUID },
      relations: ["user"],
    });

    if (!recado) {
      return null;
    }

    recado.descricao = descricao;
    recado.detalhamento = detalhamento;

    const recadoUpdated = await recado.save();

    return {
      ...recadoUpdated
    };
  }

  async delete(uid: string): Promise<null | Recado | any> {
    const recado = await RecadoEntity.findOne(uid);

    if (!recado) {
      return null;
    }

    return await recado.remove();
  }
}
