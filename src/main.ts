import { getTodaysItems, getMembers, initConfig } from "./sheets";
import { pad } from "./utils";
import Schedule from "./Schedule";
import { Config } from "./config";

function sendTypetalkMessage(text: string, config: Config) {
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    headers: {
      "X-TYPETALK-TOKEN": config.typetalkToken,
    },
    payload: {
      message: text,
    },
  };
  UrlFetchApp.fetch(config.typetalkUrl, options);
}

export function dailyMain() {
  const config = initConfig();
  if (config === null) {
    console.error("config is null");
    return;
  }

  const cb = (schedule: Schedule, now: Date) => {
    return (
      schedule.year === now.getFullYear() &&
      schedule.month === now.getMonth() + 1 &&
      schedule.day === now.getDate()
    );
  };
  const { schedule, hasNaN } = getTodaysItems(config, cb);
  if (schedule.length === 0) {
    return;
  }
  if(hasNaN) {
    console.warn("Non-numeric characters are entered in the cell that means any date and time");
  }

  const scheduleText = schedule
    .map((sche) => {
      return `・ ${pad(sche.hour, 2)}時${pad(sche.time, 2)}分: ${sche.content}`;
    })
    .join("\n");

  const members = getMembers().join(" ");
  const text = config.morningMessage
    .replace(/{MEMBERS}/g, members)
    .replace(/{SCHEDULE_LEN}/g, schedule.length.toString())
    .replace(/{SCHEDULE}/g, scheduleText)
    .replace(/{ZOOM_TEXT}/g, config.zoomUrl);

  sendTypetalkMessage(text, config);
}

export function hourAgoMain() {
  const config = initConfig();
  if (config === null) {
    console.error("config is null");
    return;
  }

  const cb = (schedule: Schedule, now: Date) => {
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    if (now <= schedule.date && schedule.date <= oneHourLater) {
      return true;
    } else {
      return false;
    }
  };
  const { schedule, hasNaN } = getTodaysItems(config, cb);
  if (schedule.length === 0) {
    return;
  }
  if(hasNaN) {
    console.warn("Non-numeric characters are entered in the cell that means any date and time");
  }

  const scheduleText = schedule
    .map((sche) => {
      return `・ ${sche.month}/${sche.day} ${pad(sche.hour, 2)}:${pad(
        sche.time,
        2
      )}: ${sche.content}`;
    })
    .join("\n");

  const members = getMembers().join(" ");
  const text = config.justBeforeMessage
    .replace(/{MEMBERS}/g, members)
    .replace(/{SCHEDULE_LEN}/g, schedule.length.toString())
    .replace(/{SCHEDULE}/g, scheduleText)
    .replace(/{ZOOM_TEXT}/g, config.zoomUrl);

  sendTypetalkMessage(text, config);
}
