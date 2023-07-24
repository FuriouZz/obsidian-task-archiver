import { TFile } from "obsidian";

export interface NoteListEntry {
  filename: string;
  title: string;
  excerpt: string;
  date: moment.Moment;
  file: TFile;
}
