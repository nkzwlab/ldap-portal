import { expect, test } from "vitest";

import { SSHA } from "../crypto";

const PASSWORD = "hello";
const SALT = "ciCeeB3T6+2PvO0tlMSaKLw/w2ljxWNXO9NJ/mwPCFo=";
const HELLO_PASSWD =
  "{SSHA}vXnyGPeudjlluY0dGq11Uet8CxhjaUNlZUIzVDYrMlB2TzB0bE1TYUtMdy93MmxqeFdOWE85TkovbXdQQ0ZvPQ==";

test("ssha", () => {
  const ssha = SSHA.withSalt(PASSWORD, SALT);
  const passwd = ssha.passwd;

  expect(passwd).toBe(HELLO_PASSWD);

  const ssha2 = SSHA.withSalt(PASSWORD + "a", SALT);
  const passwd2 = ssha2.passwd;

  expect(passwd2).not.toBe(HELLO_PASSWD);

  const salt3 = "a" + SALT.slice(1);
  const ssha3 = SSHA.withSalt(PASSWORD, salt3);
  const passwd3 = ssha3.passwd;

  expect(passwd3).not.toBe(HELLO_PASSWD);
});
