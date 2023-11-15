import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ApiState } from "../types";

const API_PATH_APPROVE = "/api/register/approval";

export type Approval = {
  approve: ApproveFunc;
  result: ApprovalResult | null;
  state: ApiState;
  setState: (state: ApiState) => void;
};

export type ApproveFunc = () => Promise<void>;

export type ApprovalResult = {
  success: boolean;
  error?: string;
};

export const useApproval = (token: string): Approval => {
  const [result, setResult] = useState<ApprovalResult | null>(null);
  const [state, setState] = useState<ApiState>("start");
  const path = API_PATH_APPROVE + `/${token}`;

  const approve = async () => {
    setState("loading");
    const resp = await axios.post(path, null, { validateStatus: () => true });

    const result = resp.data as ApprovalResult;

    if (result?.success) {
      setState("success");
    } else {
      setState("error");

      if (typeof result?.error === "undefined") {
        result.error = "Unknown error";
      }
    }

    setResult(result);
  };

  return { approve, result, state, setState };
};
