import {Service} from "./service";

export interface User {
  id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  fix?: number;
  mobile?: number;
  password?: string;
  isAdmin?: boolean;
  serviceId?: number;
  service?: Service;
}
