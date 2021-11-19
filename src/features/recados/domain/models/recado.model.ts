import { User } from "../../../../core/domain/";

export interface Recado {
  uid: string;
  descricao: string;
  detalhamento: string;
  usersUID: string;
  user: User;
}
