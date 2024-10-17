import CurrentTimeStamp from "@src/application/util/current-time-stamp";

export default class CurrentTimeStampImpl implements CurrentTimeStamp {

  get(): number {
    return Date.now();
  }

}