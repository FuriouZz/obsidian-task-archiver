import { MarkdownView, TFile } from "obsidian";
import Parser from "../parser/Parser.js";
import AbstractModule from "./AbstractModule.js";

export default class SendActionModule extends AbstractModule {
  sendAction?: HTMLElement | undefined;
  text: HTMLDivElement;
  #timeoutID: unknown;
  parser: Parser;

  onLoad() {
    this.parser = new Parser(this.plugin);

    this.text = document.createElement("div");
    this.text.textContent = "Note updated";
    this.text.style.cssText = [
      "margin-left: 5px",
      "font-size: 0.8em",
      "display: none",
    ].join(";");

    this.plugin.register(() => {
      this.sendAction?.remove();
    });

    this.plugin.registerEvent(
      this.app.workspace.on("file-open", this.#onFileOpen)
    );

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) this.#onFileOpen(view?.file);
  }

  toggle = (enabled: boolean) => {
    if (enabled) {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      this.sendAction = view?.addAction(
        "concierge-bell",
        "Commit tasks",
        this.#onActionClick
      );
      this.sendAction?.append(this.text);
    } else {
      this.sendAction?.remove();
    }
  };

  #onFileOpen = (file: TFile) => {
    const name = file.basename.toLowerCase();
    this.toggle(/^today$/.test(name));
  };

  #onActionClick = async () => {
    clearTimeout(this.#timeoutID as number);
    this.text.style.display = "none";
    await this.#commitTasks();
    this.text.style.display = "";
    this.#timeoutID = setTimeout(() => {
      this.text.style.display = "none";
    }, 1000);
  };

  #commitTasks = async () => {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      console.log("View is missing");
      return;
    }
    await view.save();
    await this.parser?.parse(view.file);
  };
}
