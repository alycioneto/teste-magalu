import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class Request {
  private api: AxiosInstance;

  private config: AxiosRequestConfig;

  constructor(baseUrl: string, config?: AxiosRequestConfig) {
    this.config = this.getConfig(baseUrl);
    this.api = axios.create({ ...this.config, ...config });
  }

  public async get(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    const newConfig = { ...config, params: data };

    return this.api.get(`${url}`, newConfig);
  }

  private getConfig(baseUrl: string): AxiosRequestConfig {
    return {
      baseURL: baseUrl,
      headers: { "Content-Type": "application/json" },
    };
  }
}

export { Request };
