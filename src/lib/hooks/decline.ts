import { useState } from "react";
import axios from "axios";

const API_PATH_DECLINE = "/api/register/approval";

export type Decline = {
  decline: DeclineFunc;
  result: DeclineResult | null;
  state: DeclineState;
  setState: (state: DeclineState) => void;
};

export type DeclineState = "start" | "loading" | "success" | "error" | "end";

export type DeclineFunc = () => Promise<void>;

export type DeclineResult = {
  success: boolean;
  error?: string;
};

export const useDecline = (token: string): Decline => {
  const [result, setResult] = useState<DeclineResult | null>(null);
  const [state, setState] = useState<DeclineState>("start");
  const path = API_PATH_DECLINE + `/${token}`;

  const decline = async () => {
    setState("loading");
    const resp = await axios.delete(path);

    const result = resp.data as DeclineResult;
    setResult(result);

    if (result?.success) {
      setState("success");
    } else if (result?.error) {
      setState("error");
    }
  };

  return { decline, result, state, setState };
};
