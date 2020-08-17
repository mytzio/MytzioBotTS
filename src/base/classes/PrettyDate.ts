import dayjs from 'dayjs';

export default class PrettyDate {

  timestamp: number | undefined;

  constructor (timestamp?: number) {
    this.timestamp = timestamp;
  }

  private date() {
    if (!this.timestamp) return dayjs();
    else return dayjs(this.timestamp);
  }

  public shortDate() {
    return this.date().format('DD.MM.YYYY');
  }

  public shortDateWithTime() {
    return this.date().format('DD.MM.YYYY HH:mm');
  }

  public longDate() {
    return this.date().format('DD.MM.YYYY');
  }

  public longDateWithTime() {
    return this.date().format('DD.MM.YYYY HH:mm:ss');
  }
}