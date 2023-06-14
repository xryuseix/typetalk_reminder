import Schedule from "./Schedule";
import { Config } from "./config";

export function getMembers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("members");
  if (sheet === null) {
    return [];
  }
  return sheet
    .getDataRange()
    .getValues()
    .map((m) => `@${m}`)
    .filter((m) => m !== "");
}

export function getTodaysItems(config: Config, callback: (s: Schedule, n: Date) => boolean) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("schedule");
  if (sheet === null) {
    return [];
  }
  const now = new Date();
  const rows = sheet.getDataRange().getValues().slice(1);

  const todaysItems = rows
    .flatMap((row) => {
      // TODO: validate row
      const schedule = new Schedule(
        row[0],
        row[1],
        row[2],
        row[3],
        row[4],
        row[5],
        config.defaultContent
      );
      if (callback(schedule, now)) {
        return [schedule];
      }
      return [];
    })
    .sort((sche1, sche2) => {
      if (sche1.hour === sche2.hour) {
        return sche1.time - sche2.time;
      } else {
        return sche1.hour - sche2.hour;
      }
    });

  return todaysItems;
}

export function initConfig() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("config");
  if (sheet === null) {
    return null;
  }
  const values = sheet.getDataRange().getValues();

  const config: Config = {
    defaultContent: values[0][1],
    morningMessage: values[1][1],
    justBeforeMessage: values[2][1],
    zoomUrl: values[3][1],
    typetalkUrl: values[4][1],
    typetalkToken: values[5][1],
  };
  return config;
}
