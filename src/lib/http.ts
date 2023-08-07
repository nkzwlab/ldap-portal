import axios from "axios";
import { env } from "./env";

export const statusOk = 200;
export const statusBadRequest = 400;
export const statusUnauthorized = 401;
export const statusForbidden = 403;
export const statusNotFound = 404;
export const statusInternalServerError = 500;

const baseURL = (domain: string, isProduction: boolean): string => {
  const url = new URL(`http://${domain}`);
  if (isProduction) {
    url.protocol = "https:";
  }
  return url.toString();
};

axios.defaults.baseURL = baseURL(env.deployDomain, env.isProduction);
