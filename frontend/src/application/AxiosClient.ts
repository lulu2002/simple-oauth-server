import {AxiosInstance} from "axios";

export default interface AxiosClient {
  instance: () => AxiosInstance;
}

