import { Notice, FuzzySuggestModal, TFile } from "obsidian";

export class FileSuggestModal extends FuzzySuggestModal<TFile> {
  onFileSelected?: (file: TFile) => void;

  getItems(): TFile[] {
    return app.vault.getMarkdownFiles();
  }

  getItemText(file: TFile): string {
    return file.path;
  }

  onChooseItem(file: TFile, evt: MouseEvent | KeyboardEvent) {
    new Notice(`Selected ${file.name}`);
    if (this.onFileSelected) this.onFileSelected(file);
  }
}
