import { SearchEntryObject } from "ldapjs";

export const toUidNumber = (entry: SearchEntryObject): number => {
  const uidNumberAttr = entry.uidNumber;
  const uidNumberStr = Array.isArray(uidNumberAttr)
    ? uidNumberAttr[0]
    : uidNumberAttr;
  return Number.parseInt(uidNumberStr);
};
