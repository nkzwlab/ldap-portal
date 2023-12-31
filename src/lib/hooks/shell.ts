import { useEffect, useState } from "react";
import axios from "axios";
import { Shell } from "../types";

const API_PATH_SHELL = "/api/shell";

export const useShell = (): [
  currentShell: Shell | null,
  reload: () => void
] => {
  const [shell, setShell] = useState<Shell | null>(null);
  const [reloadCount, setReloadCount] = useState<number>(0);
  const reload = () => setReloadCount(reloadCount + 1);

  useEffect(() => {
    const getShell = async () => {
      const resp = await axios.get(API_PATH_SHELL, {
        withCredentials: true,
      });

      setShell(resp.data.shell);
      console.log({ setShell: resp.data.shell });
    };

    getShell();
  }, [reloadCount]);

  return [shell, reload];
};

export type UpdateShell = {
  updateShell: UpdateShellFunc;
  result: UpdateShellResult | null;
};

export type UpdateShellResult = {
  success: boolean;
};

export type UpdateShellFunc = (shell: Shell) => Promise<void>;

export const useUpdateShell = (): UpdateShell => {
  const [result, setResult] = useState<UpdateShellResult | null>(null);

  const updateShell = async (shell: Shell) => {
    const resp = await axios.post(API_PATH_SHELL, {
      shell,
    });

    const result = resp.data as UpdateShellResult;
    setResult(result);
  };

  return { updateShell, result };
};
