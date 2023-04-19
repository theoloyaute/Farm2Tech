import {Service} from "./service";

export interface User {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  fix?: number;
  mobile?: number;
  password?: string;
  isAdmin?: boolean;
  serviceId?: number;
  service?: Service;
}
