import {
  HeadingCache,
  MetadataCache,
  SectionCache,
  TFile,
  Vault,
  moment,
} from "obsidian";
import Task from "./Task.js";
import Section from "./Section.js";
import FileContent from "./FileContent.js";
import { TodayPluginSettings } from "../../types.js";
import type TodayPlugin from "../../main.js";

const NOOP = () => {};

export default class Parser {
  vault: Vault;
  metadatacache: MetadataCache;
  settings: TodayPluginSettings;

  constructor(plugin: TodayPlugin) {
    this.vault = plugin.app.vault;
    this.metadatacache = plugin.app.metadataCache;
    this.settings = plugin.settings;
  }

  async parse(file: TFile) {
    const fileContent = await this.#getFileContent(file);
    if (!fileContent) return;

    const hasCheckedTask = fileContent.sections.some((section) =>
      section.hasCheckedTask()
    );
    if (!hasCheckedTask) return;

    const date = moment();
    const dirname = `${this.settings.directoryPath.replace(
      /\/*$/,
      ""
    )}/${date.format(this.settings.dirnameFormat)}`;
    const filename = `${date.format(this.settings.filenameFormat)}.md`;
    const path = `${dirname}/${filename}`;

    await this.vault.createFolder(dirname).catch(NOOP);

    let fileOfTheDay = this.vault
      .getMarkdownFiles()
      .find((f) => f.path === path);

    if (!fileOfTheDay) {
      fileOfTheDay = await this.vault.create(`${dirname}/${filename}`, "");
    }

    let sectionsToAdd: Section[] = [];

    const fileContentFOTD = await this.#getFileContent(fileOfTheDay);
    if (fileContentFOTD) {
      fileContentFOTD.sections.forEach((section) => {
        section.tasks.forEach((task) => (task.isChecked = true));
      });
      this.#mergeSections(fileContent, fileContentFOTD);
      sectionsToAdd = fileContentFOTD.sections;
    } else {
      sectionsToAdd = fileContent.sections;
    }

    const contentToAdd = sectionsToAdd
      .filter((section) => section.hasCheckedTask())
      .map((section) => `${section.getHeader()}\n${section.getContent()}\n`)
      .join("\n");

    await this.vault.modify(fileOfTheDay, contentToAdd);
    await this.vault.modify(file, fileContent.toString({ filter: true }));
  }

  async #getFileContent(file: TFile) {
    const fileCache = this.metadatacache.getFileCache(file);
    if (!fileCache || !fileCache.listItems) return undefined;

    const content = await this.vault.cachedRead(file);
    const lines = content.split(/\n\r?/);
    const lineCount = lines.length;

    const fileContent = new FileContent(lines);

    let lineNumber = 0;
    let currentSection: null | SectionCache = null;
    for (const item of fileCache.listItems) {
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
        currentSection = Parser.getSection(lineNumber, fileCache.sections);
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

      const heading = Parser.getPreviousHeading(lineNumber, fileCache.headings);
      if (!heading) continue;

      const task = Task.fromLine({ line, lineNumber });
      if (!task) continue;

      const section = fileContent.getOrCreateSection(heading, lineNumber);
      section.addTask(task);
    }

    return fileContent;
  }

  #mergeSections(
    fileContentToAdd: FileContent,
    currentFileContent: FileContent
  ) {
    for (const sectionToAdd of fileContentToAdd.sections) {
      const section = currentFileContent.getOrCreateSection(
        sectionToAdd.heading
      );

      for (const task of sectionToAdd.tasks) {
        if (task.isChecked) {
          section.addTask(
            new Task({
              title: task.title,
              isChecked: true,
            })
          );
        }
      }
    }
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
