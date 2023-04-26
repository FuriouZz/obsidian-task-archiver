import { TFile } from "obsidian";

export interface ListEntry {
  filename: string;
  title: string;
  excerpt: string;
  date: moment.Moment;
  file: TFile;
}
