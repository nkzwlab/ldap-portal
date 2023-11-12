"use server";

import axios from "axios";
import { env } from "../env";

const baseURL = (domain: string, isProduction: boolean): string => {
  const url = new URL(`http://${domain}`);
  if (isProduction) {
    url.protocol = "https:";
  }
  return url.toString();
};

axios.defaults.baseURL = baseURL(env.deployDomain, env.isProduction);
