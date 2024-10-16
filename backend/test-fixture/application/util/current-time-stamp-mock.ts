import CurrentTimeStamp from "@src/application/util/current-time-stamp";

export default class CurrentTimeStampMock implements CurrentTimeStamp {
  constructor(public time: number) {
  }

  get(): number {
    return this.time;
  }
}