import { useState } from "react";
import axios from "axios";
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
    const resp = await axios.post(path);

    const result = resp.data as ApprovalResult;
    setResult(result);

    if (result?.success) {
      setState("success");
    } else if (result?.error) {
      setState("error");
    }
  };

  return { approve, result, state, setState };
};
