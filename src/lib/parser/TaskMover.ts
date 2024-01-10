import { TFile } from "obsidian";
import Section from "./Section.js";
import Task from "./Task.js";
import Document from "./Document.js";
import Parser from "./Parser.js";
import { ITaskTransformer, TFilterCallback } from "../../types.js";

export default class TaskMover {
  parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async send(fromFile: TFile, toFile: TFile, transformer: ITaskTransformer) {
    const filter = transformer.onTaskValid.bind(transformer);

    const fromDoc = await this.parser.getDocument(fromFile);
    const fromFilteredDoc = fromDoc.toFiltered(filter);
    if (!fromFilteredDoc.hasSections()) return;

    let sectionsToAdd: Section[] = [];

    const toDoc = await this.parser.getDocument(toFile);

    if (toDoc.lines.length > 0) {
      toDoc.sections.forEach((section) => {
        section.tasks.forEach((task) => transformer.onEditTask(task));
      });
      this.#mergeSections(fromFilteredDoc, toDoc);
      sectionsToAdd = toDoc.sections;
    } else {
      sectionsToAdd = fromFilteredDoc.sections;
    }

    const srcContent = this.#getContent(fromDoc, filter);
    const destContent = sectionsToAdd
      .map((section) => `${section.getHeader()}\n${section.getContent()}\n`)
      .join("\n");

    await app.vault.modify(toFile, destContent);
    await app.vault.modify(fromFile, srcContent);
  }

  #mergeSections(fromDoc: Document, toDoc: Document) {
    for (const sectionToAdd of fromDoc.sections) {
      const section = toDoc.getOrCreateSection(
        sectionToAdd.heading,
        toDoc.lines.length + 1
      );

      for (const task of sectionToAdd.tasks) {
        section.addTask(
          new Task({
            title: task.title,
            isChecked: task.isChecked,
          })
        );
      }
    }
  }

  #getContent(doc: Document, filter: TFilterCallback<Task>) {
    const linesToRemove = new Set<number>();

    doc.sections.forEach((section) => {
      const isEmpty = section.tasks.every((task) => filter(task));
      if (isEmpty) linesToRemove.add(section.lineNumber);

      section.tasks.forEach((task) => {
        if (filter(task)) {
          linesToRemove.add(task.lineNumber);
        }
      });
    });

    return doc.lines
      .filter((_, index) => !linesToRemove.has(index))
      .join("\n")
      .trim();
  }
}
