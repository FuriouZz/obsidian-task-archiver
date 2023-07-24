import { TFile } from "obsidian";

export interface TaskListEntry {
  filename: string;
  title: string;
  excerpt: string;
  date: moment.Moment;
  file: TFile;
}
