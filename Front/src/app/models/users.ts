import {Service} from "./service";

export interface User {
  id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  fix?: number;
  mobile?: number;
  password?: string;
  isadmin?: boolean;
  serviceId?: number;
  service?: Service;
}
