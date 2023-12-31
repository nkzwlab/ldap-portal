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
    const uidNumberStr = this.getEnv("UID_NUMBER_START", "10001");
    return Number(uidNumberStr);
  }
  get defaultGidNumber(): number {
    const gidNumberStr = this.getEnv("DEFAULT_GID_NUMBER", "10001");
    return Number(gidNumberStr);
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
  get adminGroup(): string {
    return this.getEnv("ADMIN_GROUP");
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

  get slackSigningSecret(): string {
    return this.getEnv("SLACK_SIGNING_SECRET");
  }
  get slackBotToken(): string {
    return this.getEnv("SLACK_BOT_TOKEN");
  }
  get slacWebhookUrl(): string {
    return this.getEnv("SLACK_WEBHOOK_URL");
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
