import type { HeadingCache } from "obsidian";
import Section from "./Section.js";

export default class FileContent {
    lines: string[];
    sections: Section[];

    constructor(lines: string[]) {
        this.lines = lines;
        this.sections = [];
    }

    getOrCreateSection(heading: HeadingCache, lineNumber = -1) {
        let section = this.sections.find((section) => {
            return (
                heading.heading === section.heading.heading &&
                heading.level === section.heading.level
            );
        });

        if (!section) {
            section = new Section({ heading, lineNumber });
            this.sections.push(section);
        }

        return section;
    }

    toString({ filter = true }) {
        if (!filter) return this.lines.join("\n");

        const linesToRemove = new Set<number>();

        this.sections.forEach((section) => {
            if (section.hasAllTaskChecked()) {
                linesToRemove.add(section.heading.position.start.line);
                const latestLine = section.tasks.reduce(
                    (v, t) => Math.max(v, t.lineNumber),
                    -Infinity,
                );

                if (
                    this.lines[latestLine + 1] !== undefined &&
                    this.lines[latestLine + 1] === ""
                ) {
                    linesToRemove.add(latestLine + 1);
                }
            }

            section.tasks.forEach((task) => {
                if (task.isChecked) {
                    linesToRemove.add(task.lineNumber);
                }
            });
        });

        return this.lines
            .filter((_, index) => !linesToRemove.has(index))
            .join("\n");
    }
}
