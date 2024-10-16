export default class CurrentTimeStampImpl implements CurrentTimeStamp {

  get(): number {
    return Date.now();
  }

}