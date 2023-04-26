import { ICalendarSource, IDot } from "obsidian-calendar-ui";

const noteSource: ICalendarSource = {
  async getDailyMetadata(date) {
    const file = app.vault
      .getMarkdownFiles()
      .find((f) => date.isSame(f.stat.ctime, "day"));

    const dots: IDot[] = [];
    const classes: string[] = [];

    if (file) {
      dots.push({
        className: "hola",
        color: "default",
        isFilled: true,
      });
    }

    return {
      classes,
      dots,
    };
  },
  async getWeeklyMetadata() {
    return {};
  },
};

export default noteSource;
