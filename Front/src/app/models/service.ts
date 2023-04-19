import {Site} from "./site";

export interface Service {
  id?: number;
  name?: string;
  siteId?: number;
  site?: Site;
}
