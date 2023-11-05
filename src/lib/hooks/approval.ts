import { useState } from "react";
import axios from "axios";

const API_PATH_APPROVE = "/api/register/approval";

export type Approval = {
  approve: ApproveFunc;
  result: ApprovalResult | null;
};

export type ApproveFunc = () => Promise<void>;

export type ApprovalResult = {
  success: boolean;
};

export const useApproval = (token: string): Approval => {
  const [result, setResult] = useState<ApprovalResult | null>(null);

  const approve = async () => {
    const resp = await axios.post(API_PATH_APPROVE, {
      token,
    });

    const result = resp.data as ApprovalResult;
    setResult(result);
  };

  return { approve, result };
};
