import QueryParams from "./QueryParams";

export default class QueryParamsMock implements QueryParams {

  private params: Map<string, string> = new Map<string, string>();

  get(key: string): string | null {
    return this.params.get(key) || null;
  }

  set(key: string, value: string) {
    this.params.set(key, value);
  }

}