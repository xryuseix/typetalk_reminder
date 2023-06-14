class Schedule {
  year: number;
  month: number;
  day: number;
  hour: number;
  time: number;
  content: string;

  constructor(
    year: string,
    month: string,
    day: string,
    hour: string,
    time: string,
    content: string,
    private defaultContent: string
  ) {
    this.year = +year;
    this.month = +month;
    this.day = +day;
    this.hour = +hour;
    this.time = time !== "" ? +time : 0;
    this.content = content !== "" ? content : defaultContent;
  }

  get date() {
    return new Date(
      `${this.year}/${this.month}/${this.day} ${this.hour}:${this.time}:00`
    );
  }
}

export default Schedule;
