import { dailyMain, hourAgoMain } from "./main";

declare const global: {
  [x: string]: unknown;
};

global.dailyMain = dailyMain;
global.hourAgoMain = hourAgoMain;
