import axios, {AxiosInstance} from "axios";
import {AxiosClient} from "@src/application/AxiosClient.ts";

export class AxiosClientImpl implements AxiosClient {

  private readonly _instance: AxiosInstance;

  constructor(baseURL: string) {
    this._instance = axios.create({
      baseURL: baseURL,
      timeout: 1000,
    });
  }

  instance(): AxiosInstance {
    return this._instance;
  }


}