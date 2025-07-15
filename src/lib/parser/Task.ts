import { TaskRegularExpressions } from "./TaskRegularExpressions.js";

export default class Task {
    title: string;
    isChecked: boolean;
    lineNumber: number;

    constructor({
        lineNumber = -1,
        title = "",
        isChecked = false,
    }: {
        lineNumber?: number;
        title?: string;
        isChecked?: boolean;
    }) {
        this.title = title;
        this.isChecked = isChecked;
        this.lineNumber = lineNumber;
    }

    toString() {
        return this.title;
    }

    static fromLine({
        line,
        lineNumber,
    }: {
        line: string;
        lineNumber: number;
    }) {
        const match = line.match(TaskRegularExpressions.taskRegex);
        if (!match) return;
        const isChecked = match[3] === "x";
        const title = match[4];
        return new Task({ title, isChecked, lineNumber });
    }
}
