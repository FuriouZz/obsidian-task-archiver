import AbstractModule from "./AbstractModule.js";
import { Menu, Notice, TFile } from "obsidian";
import TaskMover from "../parser/TaskMover.js";
import PluginStore from "../../stores/PluginStore.js";
import { FileSuggestModal } from "../obsidian/FileSuggestModal.js";
import ConfigStore from "../../stores/ConfigStore.js";
import DotDecorations from "../codemirror/DotDecorations.js";

export default class TaskMoverModule extends AbstractModule {
  mover = new TaskMover();
  isActionAdded = false;

  onLoad() {
    this.plugin.registerEditorExtension(
      // DotExtensions({
      //   onClick(view, line, event) {
      //     menu.showAtMouseEvent(event);
      //   },
      // })
      DotDecorations({
        onClick: ({ view, line, event, isSection }) => {
          this.#createMenu(line.number - 1, isSection).showAtMouseEvent(event);
        },
      })
    );
  }

  #createMenu(lineNumber: number, isSection = false, menu: Menu = new Menu()) {
    if (isSection) {
      menu.addItem((item) =>
        item
          .setTitle("Move completed tasks")
          .setIcon("forward")
          .onClick(() => {
            this.moveTasksToDailyNote(lineNumber);
          })
      );
    } else {
      menu.addItem((item) => {
        item
          .setTitle("Move task to...")
          .setIcon("forward")
          .onClick(() => {
            const modal = new FileSuggestModal(app);
            modal.onFileSelected = (file) => {
              this.moveTaskTo(lineNumber, file);
            };
            modal.open();
          });
      });
    }
    return menu;
  }

  async moveTasksToDailyNote(lineNumber: number) {
    const fromFile = PluginStore.activeFile.value;
    if (!fromFile) return;

    const dailyNote = await ConfigStore.getDailyNoteFile();

    await this.mover.send(fromFile, dailyNote, {
      onTaskValid: (task) => task.lineNumber > lineNumber && task.isChecked,
      onEditTask: (task) => (task.isChecked = true),
    });

    new Notice(`Tasks moved to: ${dailyNote.path}`);
  }

  async moveTaskTo(lineNumber: number, toFile: TFile) {
    const fromFile = PluginStore.activeFile.value;
    if (!fromFile) return;

    await this.mover.send(fromFile, toFile, {
      onTaskValid: (task) => {
        return task.lineNumber === lineNumber;
      },
      onEditTask(_task) {},
    });

    new Notice(`Tasks moved to: ${toFile.path}`);
  }
}
