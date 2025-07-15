import { AbstractInputSuggest, type TAbstractFile } from "obsidian";

export class FileInputSuggester extends AbstractInputSuggest<TAbstractFile> {
    protected getSuggestions(
        query: string,
    ): TAbstractFile[] | Promise<TAbstractFile[]> {
        return this.app.vault
            .getMarkdownFiles()
            .filter(
                (file) =>
                    file.path.includes(query) ||
                    file.path.toLocaleLowerCase().includes(query),
            );
    }

    renderSuggestion(value: TAbstractFile, el: HTMLElement): void {
        el.setText(value.path);
    }
}
