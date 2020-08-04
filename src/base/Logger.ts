import dayjs from 'dayjs';

export default class Logger {
  timeformat: string;

  constructor () {
    this.timeformat = 'DD-MM-YYYY HH:mm:ss';
  }

  public error(msg: string) {
    console.log(`${dayjs().format(this.timeformat)} [ERROR]: ${msg}`);
    console.trace();
  }

  public warn(msg: string | string[]) {
    console.log(`${dayjs().format(this.timeformat)} [WARNING]:`);
    console.warn(...msg);
  }

  public log(msg: string) {
    console.log(`${dayjs().format(this.timeformat)} [INFO]: ${msg}`);

  }

}