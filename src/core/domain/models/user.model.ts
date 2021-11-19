import { Recado } from "../../../features/recados/domain";

export interface User {
  uid: string;
  username: string;
  password: string;
  recados?: Recado[];
}
