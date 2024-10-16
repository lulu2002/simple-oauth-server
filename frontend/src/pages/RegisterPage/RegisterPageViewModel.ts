import {AuthProxy} from "@src/application/auth/AuthProxy";
import {RegisterAccountResult} from "@src/domain/RegisterAccount";

export default class RegisterPageViewModel {

  constructor(private authProxy: AuthProxy) {
  }

  async register(username: string, password: string): Promise<RegisterAccountResult> {
    return this.authProxy.registerAccount({email: username, password: password});
  }

}