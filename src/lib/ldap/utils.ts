import { SearchEntryObject } from "ldapjs";

export const toUidNumber = (entry: any): number | null => {
  if (typeof entry.attributes === "string") {
    return Number.parseInt(entry.attributes);
  }

  const uidNumberAttrs = entry.attributes.filter(
    ({ type }: { type: string }) => type === "uidNumber"
  );

  if (uidNumberAttrs.length < 1) {
    console.error(
      "toUidNumber: The entry does not have uidNumber attribute:",
      entry
    );
    return null;
  } else if (uidNumberAttrs.length > 1) {
    console.warn(
      "toUidNumber: There were 2 or more 'uidNumber' attributes. Using the first one.",
      uidNumberAttrs
    );
  }

  // FIXME: .values may have no values or 2 or or more values. We should handle such edge cases
  const uidNumberStr = uidNumberAttrs[0].values[0];
  return Number.parseInt(uidNumberStr);
};
