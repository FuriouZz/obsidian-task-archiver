import { HeadingCache } from "obsidian";
import Section from "./Section.js";
import { TFilterCallback } from "../../types.js";
import Task from "./Task.js";

export default class Document {
  lines: string[];
  sections: Section[];

  constructor(lines: string[]) {
    this.lines = lines;
    this.sections = [];
  }

  hasSections() {
    return this.sections.length > 0;
  }

  getOrCreateSection(heading: HeadingCache, lineNumber = -1) {
    let section = this.sections.find((section) => {
      return (
        heading.heading === section.heading.heading &&
        heading.level === section.heading.level
      );
    });

    if (!section) {
      section = new Section({ heading, lineNumber });
      this.sections.push(section);
    }

    return section;
  }

  toFiltered(filter: TFilterCallback<Task>) {
    const doc = new Document([...this.lines]);
    doc.sections = this.sections
      .map((section) => section.toFiltered(filter))
      .filter((section) => section.hasTasks());
    return doc;
  }
}
