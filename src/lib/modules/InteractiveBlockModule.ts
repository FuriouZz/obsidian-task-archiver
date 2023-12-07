import AbstractModule from "./AbstractModule.js";
import { Menu, Notice } from "obsidian";
// import DotExtensions from "../codemirror/DotExtensions.js";
import DotDecorations from "../codemirror/DotDecorations.js";

export default class InteractiveBlockModule extends AbstractModule {
  onLoad() {
    const menu = new Menu();

    menu.addItem((item) =>
      item
        .setTitle("Copy")
        .setIcon("documents")
        .onClick(() => {
          new Notice("Copied");
        })
    );

    menu.addItem((item) =>
      item
        .setTitle("Paste")
        .setIcon("paste")
        .onClick(() => {
          new Notice("Pasted");
        })
    );

    this.plugin.registerEditorExtension(
      // DotExtensions({
      //   onClick(view, line, event) {
      //     menu.showAtMouseEvent(event);
      //   },
      // })
      DotDecorations({
        onClick(view, line, event) {
          menu.showAtMouseEvent(event);
        },
      })
    );
  }
}
