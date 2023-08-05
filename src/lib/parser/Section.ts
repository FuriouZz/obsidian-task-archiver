import { HeadingCache } from "obsidian";
import Task from "./Task.js";

export default class Section {
  heading: HeadingCache;
  tasks: Task[];
  lineNumber: number;

  constructor({
    heading,
    lineNumber,
  }: {
    heading: HeadingCache;
    lineNumber: number;
  }) {
    this.heading = heading;
    this.lineNumber = lineNumber;
    this.tasks = [];
  }

  addTask(...tasks: Task[]) {
    for (const task of tasks) {
      const index = this.tasks.findIndex((t) => t.title === task.title);
      if (index === -1) {
        this.tasks.push(task);
      }
    }
  }

  getHeader() {
    const level = new Array(this.heading.level).fill("#").join("");
    return `${level} ${this.heading.heading}`;
  }

  getContent() {
    return this.tasks
      .filter((task) => task.isChecked)
      .map((task) => `* [-] ${task.toString()}`)
      .join("\n");
  }

  hasCheckedTask() {
    return this.tasks.some((task) => task.isChecked);
  }

  hasAllTaskChecked() {
    return this.tasks.every((task) => task.isChecked);
  }
}
