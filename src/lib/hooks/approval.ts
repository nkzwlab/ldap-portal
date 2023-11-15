import { useState } from "react";
import axios from "axios";

const API_PATH_APPROVE = "/api/register/approval";

export type Approval = {
  approve: ApproveFunc;
  result: ApprovalResult | null;
  state: ApprovalState;
  setState: (state: ApprovalState) => void;
};

export type ApprovalState = "start" | "loading" | "approved" | "error" | "end";

export type ApproveFunc = () => Promise<void>;

export type ApprovalResult = {
  success: boolean;
  error?: string;
};

export const useApproval = (token: string): Approval => {
  const [result, setResult] = useState<ApprovalResult | null>(null);
  const [state, setState] = useState<ApprovalState>("start");

  const approve = async () => {
    setState("loading");
    const resp = await axios.post(API_PATH_APPROVE, {
      token,
    });

    const result = resp.data as ApprovalResult;
    setResult(result);

    if (result?.success) {
      setState("approved");
    } else if (result?.error) {
      setState("error");
    }
  };

  return { approve, result, state, setState };
};
