import { TFile } from "obsidian";

export interface NoteListEntry {
  filename: string;
  title: string;
  excerpt: string;
  date: moment.Moment;
  file: TFile;
}

export interface TodayPluginSettings {
  filenameFormat: string;
  dirnameFormat: string;
  directoryPath: string;
}
