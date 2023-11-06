import { useEffect, useState } from "react";
import axios from "axios";
import { ApiGetPubkeysResponse } from "@/app/api/pubkeys/route";

const API_PATH_PUBKEYS = "/api/pubkeys";

export const usePubkeys = (): [
  currentPubkeys: string[] | null,
  reload: () => void
] => {
  const [pubkey, setPubkeys] = useState<string[] | null>(null);
  const [reloadCount, setReloadCount] = useState<number>(0);
  const reload = () => setReloadCount(reloadCount + 1);

  useEffect(() => {
    const getPubkeys = async () => {
      const resp = await axios.get<ApiGetPubkeysResponse>(API_PATH_PUBKEYS, {
        withCredentials: true,
      });

      setPubkeys(resp.data.pubkeys);
    };

    getPubkeys();
  }, [reloadCount]);

  return [pubkey, reload];
};

export type PutPubkey = {
  putPubkeys: PutPubkeyFunc;
  result: PutPubkeyResult | null;
};

export type PutPubkeyResult = {
  success: boolean;
  pubkeys: string[];
};

export type PutPubkeyFunc = (pubkeys: string[]) => Promise<void>;

export const usePutPubkey = (): PutPubkey => {
  const [result, setResult] = useState<PutPubkeyResult | null>(null);

  const putPubkey = async (pubkeys: string[]) => {
    const resp = await axios.put(API_PATH_PUBKEYS, {
      pubkeys,
    });

    const result = resp.data as PutPubkeyResult;
    setResult(result);
  };

  return { putPubkeys: putPubkey, result };
};
