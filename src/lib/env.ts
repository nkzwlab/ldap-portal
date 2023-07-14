class Config {
  getEnv(key: string): string {
    const value = process.env[key];
    if (typeof value === "undefined") {
      throw new Error(`environment variable ${key} is not set`);
    }

    return value;
  }
  get ldapOption(): { url: string } {
    return { url: this.getEnv("LDAP_URI") };
  }
  get domain(): string {
    return this.getEnv("LDAP_DOMAIN");
  }
  get secret(): string {
    return this.getEnv("SECRET");
  }
  get password(): string {
    return this.getEnv("PASSWORD");
  }
  get adminCN(): string {
    return this.getEnv("ADMIN_CN");
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
