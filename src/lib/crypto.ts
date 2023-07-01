import * as crypto from "crypto";

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

  static withSalt(plainPassword: string, salt: string): SSHA {
    const digest = SSHA.createDigest(plainPassword, salt);
    return new SSHA(digest, salt);
  }

  static async withRandomSalt(plainPassword: string): Promise<SSHA> {
    const salt = await SSHA.randomSalt();
    const digest = SSHA.createDigest(plainPassword, salt);
    return new SSHA(digest, salt);
  }

  static randomSalt(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      crypto.randomBytes(SALT_LENGTH, function (err, buf) {
        if (err) {
          reject(err);
        }

        const saltStr = buf.toString("base64");
        resolve(saltStr);
      });
    });
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

  static createDigest(plainText: string, salt: string): string {
    const ctx = crypto.createHash("sha1");
    ctx.update(plainText, "utf-8");
    ctx.update(salt, "binary");

    const digest = ctx.digest("binary");
    const encoded = Buffer.from(digest + salt, "binary").toString("base64");
    return encoded;
  }

  verify(plainPassword: string): boolean {
    const another = SSHA.withSalt(plainPassword, this.salt);
    return this.digest === another.digest;
  }
}
