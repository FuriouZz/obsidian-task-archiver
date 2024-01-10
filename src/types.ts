import type { TFile } from "obsidian";
import type Task from "./lib/parser/Task.js";

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

export interface ITaskTransformer {
  onTaskValid(task: Task): boolean;
  onEditTask(task: Task): void;
}

export interface TFilterCallback<T> {
  (value: T): boolean;
}
