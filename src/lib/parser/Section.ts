import { HeadingCache } from "obsidian";
import Task from "./Task.js";
import { TFilterCallback } from "../../types.js";

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

  get title() {
    return this.heading.heading;
  }

  addTask(...tasks: Task[]) {
    for (const task of tasks) {
      if (task.lineNumber <= this.lineNumber) {
        task.lineNumber = this.lineNumber + this.tasks.length + 1;
      }
      this.tasks.push(task);
    }
  }

  getHeader() {
    const level = new Array(this.heading.level).fill("#").join("");
    return `${level} ${this.heading.heading}`;
  }

  getContent() {
    return this.tasks
      .map((task) => `* [${task.isChecked ? "-" : " "}] ${task.toString()}`)
      .join("\n");
  }

  hasTasks() {
    return this.tasks.length > 0;
  }

  hasCheckedTasks() {
    return this.tasks.some((task) => task.isChecked);
  }

  hasAllTaskChecked() {
    return this.tasks.every((task) => task.isChecked);
  }

  toFiltered(filter: TFilterCallback<Task>) {
    const section = new Section({
      heading: this.heading,
      lineNumber: this.lineNumber,
    });
    section.tasks = this.tasks.filter((task) => filter(task));
    return section;
  }
}
