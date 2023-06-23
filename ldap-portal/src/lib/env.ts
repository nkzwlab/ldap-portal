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
}

export const env = new Config();
