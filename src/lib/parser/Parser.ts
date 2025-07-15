import {
    type App,
    type HeadingCache,
    type MetadataCache,
    type SectionCache,
    TFile,
    TFolder,
    type Vault,
} from "obsidian";
import type TaskArchiverPlugin from "../../main.js";
import type { Settings } from "../../types.js";
import FileContent from "./FileContent.js";
import type Section from "./Section.js";
import Task from "./Task.js";

function parentFolderPath(path: string) {
    return path.replace(/\/?[^/]*$/, "") || "/";
}

async function findOrCreateFolder(app: App, path: string) {
    let folder = app.vault.getAbstractFileByPath(path);
    if (folder instanceof TFile) {
        throw new Error(`There is already a file: ${folder.path}`);
    }
    if (!folder) {
        folder = await app.vault.createFolder(path);
    }
    return folder;
}

async function findOrCreateNote(app: App, path: string) {
    let file = app.vault.getAbstractFileByPath(path);
    if (file instanceof TFolder) {
        throw new Error(`There is already a folder: ${file.path}`);
    }
    if (!file) {
        const folder = parentFolderPath(path);
        if (folder) {
            await findOrCreateFolder(app, folder);
        }
        file = await app.vault.create(path, "");
    }
    return file as TFile;
}

export default class Parser {
    vault: Vault;
    metadatacache: MetadataCache;
    settings: Settings;
    app: App;

    constructor(plugin: TaskArchiverPlugin) {
        this.app = plugin.app;
        this.vault = plugin.app.vault;
        this.metadatacache = plugin.app.metadataCache;
        this.settings = plugin.settings;
    }

    async parse(file: TFile) {
        const fileContent = await this.#getFileContent(file);
        if (!fileContent) return;

        const hasCheckedTask = fileContent.sections.some((section) =>
            section.hasCheckedTask(),
        );
        if (!hasCheckedTask) return;

        const path = this.settings.targetFile;
        if (!path) return;

        const fileOfTheDay = await findOrCreateNote(this.app, path);

        let sectionsToAdd: Section[] = [];

        const fileContentFOTD = await this.#getFileContent(fileOfTheDay);
        if (fileContentFOTD) {
            for (const section of fileContentFOTD.sections) {
                for (const task of section.tasks) {
                    task.isChecked = true;
                }
            }
            this.#mergeSections(fileContent, fileContentFOTD);
            sectionsToAdd = fileContentFOTD.sections;
        } else {
            sectionsToAdd = fileContent.sections;
        }

        const contentToAdd = sectionsToAdd
            .filter((section) => section.hasCheckedTask())
            .map(
                (section) =>
                    `${section.getHeader()}\n${section.getContent()}\n`,
            )
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
                    `${file.path} Obsidian gave us a line number ${lineNumber} past the end of the file. ${lineCount}.`,
                );
                break;
            }

            if (
                currentSection === null ||
                (currentSection &&
                    currentSection.position.end.line < lineNumber)
            ) {
                // We went past the current section (or this is the first task).
                // Find the section that is relevant for this task and the following of the same section.
                currentSection = Parser.getSection(
                    lineNumber,
                    fileCache.sections,
                );
                // sectionIndex = 0;
            }

            if (currentSection === null) {
                // Cannot process a task without a section.
                continue;
            }

            const line = lines[lineNumber];
            if (line === undefined) {
                console.log(
                    `${file.path}: line ${lineNumber} - ignoring 'undefined' line.`,
                );
                continue;
            }

            const heading = Parser.getPreviousHeading(
                lineNumber,
                fileCache.headings,
            );
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
        currentFileContent: FileContent,
    ) {
        for (const sectionToAdd of fileContentToAdd.sections) {
            const section = currentFileContent.getOrCreateSection(
                sectionToAdd.heading,
            );

            for (const task of sectionToAdd.tasks) {
                if (task.isChecked) {
                    section.addTask(
                        new Task({
                            title: task.title,
                            isChecked: true,
                        }),
                    );
                }
            }
        }
    }

    static getPreviousHeading(
        lineNumberTask: number,
        headings: HeadingCache[] | undefined,
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
        sections: SectionCache[] | undefined,
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
