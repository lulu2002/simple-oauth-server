import QueryParams from "./QueryParams";

export default class QueryParamsImpl implements QueryParams {

  get(key: string): string | null {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
  }

}