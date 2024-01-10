import { HeadingCache, SectionCache, TFile } from "obsidian";
import Task from "./Task.js";
import Document from "./Document.js";

export default class Parser {
  async getDocument(file: TFile) {
    const fileContent = new Document([]);
    const metadata = app.metadataCache.getFileCache(file);
    if (!metadata?.listItems) return fileContent;

    const content = await app.vault.cachedRead(file);
    const lines = content.split(/\n\r?/);
    const lineCount = lines.length;
    fileContent.lines = lines;

    let lineNumber = 0;
    let currentSection: null | SectionCache = null;
    for (const item of metadata.listItems) {
      if (item.task === undefined) {
        continue;
      }

      lineNumber = item.position.start.line;

      if (lineNumber >= lineCount) {
        console.log(
          `${file.path} Obsidian gave us a line number ${lineNumber} past the end of the file. ${lineCount}.`
        );
        break;
      }

      if (
        currentSection === null ||
        (currentSection && currentSection.position.end.line < lineNumber)
      ) {
        // We went past the current section (or this is the first task).
        // Find the section that is relevant for this task and the following of the same section.
        currentSection = Parser.getSection(lineNumber, metadata.sections);
        // sectionIndex = 0;
      }

      if (currentSection === null) {
        // Cannot process a task without a section.
        continue;
      }

      const line = lines[lineNumber];
      if (line === undefined) {
        console.log(
          `${file.path}: line ${lineNumber} - ignoring 'undefined' line.`
        );
        continue;
      }

      const heading = Parser.getPreviousHeading(lineNumber, metadata.headings);
      if (!heading) continue;

      const task = Task.fromLine({ line, lineNumber });
      if (!task) continue;

      const section = fileContent.getOrCreateSection(
        heading,
        heading.position.start.line
      );
      section.addTask(task);
    }

    return fileContent;
  }

  static getPreviousHeading(
    lineNumberTask: number,
    headings: HeadingCache[] | undefined
  ) {
    let previousHeading: HeadingCache | null = null;

    if (!headings) return previousHeading;

    for (const heading of headings) {
      if (heading.position.start.line > lineNumberTask) {
        return previousHeading;
      }
      previousHeading = heading;
    }

    return previousHeading;
  }

  static getSection(
    lineNumberTask: number,
    sections: SectionCache[] | undefined
  ) {
    const section = sections?.find((section) => {
      return (
        section.position.start.line <= lineNumberTask &&
        section.position.end.line >= lineNumberTask
      );
    });
    return section ?? null;
  }
}
