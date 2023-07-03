import { webcrypto as crypto } from "crypto";

import { arrayBufferToBuffer, bufferToArrayBuffer } from "./buffer";
import { encodeUtf8 } from "./encode";

export const SALT_LENGTH = 32;
export const SSHA_SIGNATURE = "{SSHA}";
export const SHA1_DIGEST_LENGTH = 20;

/**
 * Performs some operations related to SSHA.
 * For more details about SSHA, see: https://www.openldap.org/faq/data/cache/347.html.
 *
 * @export
 * @class SSHA
 */
export class SSHA {
  private salt: string;
  private digest: string;

  constructor(digest: string, salt: string) {
    this.salt = salt;
    this.digest = digest;
  }

  static async withSalt(plainPassword: string, salt: string): Promise<SSHA> {
    const digest = await SSHA.createDigest(plainPassword, salt);
    return new SSHA(digest, salt);
  }

  static async withRandomSalt(plainPassword: string): Promise<SSHA> {
    const salt = await SSHA.randomSalt();
    const digest = await SSHA.createDigest(plainPassword, salt);
    return new SSHA(digest, salt);
  }

  static randomSalt(): string {
    const buff = secureRandomNumber(SALT_LENGTH);
    const saltStr = buff.toString("base64");
    return saltStr;
  }

  static fromHashedPassword(hashedPassword: string): SSHA {
    if (hashedPassword.startsWith(SSHA_SIGNATURE)) {
      throw new Error("Not an SSHA string");
    }

    const encodedHashedPassword = hashedPassword.slice(SSHA_SIGNATURE.length);
    const hashBuffer = Buffer.from(encodedHashedPassword, "base64");

    const digest = hashBuffer.toString("binary", 0, SHA1_DIGEST_LENGTH);
    const salt = hashBuffer.toString("binary", SHA1_DIGEST_LENGTH);

    return new SSHA(digest, salt);
  }

  static async createDigest(plainText: string, salt: string): Promise<string> {
    const textBuff = encodeUtf8(plainText);
    const saltBuff = Buffer.from(salt);
    const contentBuff = Buffer.concat([textBuff, saltBuff]);

    const digest = await sha1Hash(contentBuff);
    const encoded = Buffer.concat([digest, saltBuff]).toString("base64");
    return encoded;
  }

  get passwd(): string {
    return `{SSHA}${this.digest}`;
  }

  async verify(plainPassword: string): Promise<boolean> {
    const another = await SSHA.withSalt(plainPassword, this.salt);
    return this.digest === another.digest;
  }
}

const secureRandomNumber = (nBytes: number): Buffer => {
  const arr = new Uint8Array(nBytes);
  crypto.getRandomValues(arr);

  const buff = Buffer.from(arr);
  return buff;
};

const sha1Hash = async (buff: Buffer): Promise<Buffer> => {
  const arr = bufferToArrayBuffer(buff);
  const hash = await crypto.subtle.digest("SHA-1", arr);
  const hashBuff = arrayBufferToBuffer(hash);
  return hashBuff;
};
