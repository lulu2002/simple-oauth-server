import {AxiosInstance} from "axios";
import AxiosClient from "@src/application/AxiosClient.ts";

export class AxiosClientFixed implements AxiosClient {

  constructor(private readonly _instance: AxiosInstance) {
  }

  instance(): AxiosInstance {
    return this._instance;
  }

}