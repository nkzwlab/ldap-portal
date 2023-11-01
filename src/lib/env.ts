class Config {
  getEnv(key: string, defaultValue?: string): string {
    const value = process.env[key];

    if (typeof value === "undefined") {
      if (typeof defaultValue === "undefined") {
        throw new Error(`environment variable ${key} is not set`);
      }

      return defaultValue;
    }

    return value;
  }

  get ldapOption(): { url: string } {
    return { url: this.getEnv("LDAP_URI") };
  }
  get domain(): string {
    return this.getEnv("LDAP_DOMAIN");
  }
  get uidNumberStart(): number {
    const uidNumberStr = this.getEnv("UID_NUMBER_START", "10000");
    return Number(uidNumberStr);
  }
  get secret(): string {
    return this.getEnv("SECRET");
  }
  get password(): string {
    return this.getEnv("PASSWORD");
  }
  get deployDomain(): string {
    return this.getEnv("DEPLOY_DOMAIN");
  }
  get adminCN(): string {
    return this.getEnv("ADMIN_CN");
  }
  get defaultEmailDomain(): string {
    return this.getEnv("EMAIL_DOMAIN");
  }
  get redisUrl(): string {
    return this.getEnv("REDIS_URL");
  }
  get redisUser(): string {
    return this.getEnv("REDIS_USER");
  }
  get redisPassword(): string {
    return this.getEnv("REDIS_PASSWORD");
  }
  get nodeEnv(): string {
    const nodeEnv = this.getEnv("NODE_ENV");
    return nodeEnv;
  }
  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }
  get isTest(): boolean {
    return this.nodeEnv === "test";
  }
  get isDev(): boolean {
    return !this.isProduction;
  }
}

export const env = new Config();
