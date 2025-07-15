import type { App } from "obsidian";
import type { ICalendarSource, IDot } from "obsidian-calendar-ui";

export function createNoteSource(app: App) {
    return <ICalendarSource>{
        async getDailyMetadata(date) {
            const file = app.vault
                .getMarkdownFiles()
                .find((f) => date.isSame(f.stat.ctime, "day"));

            const dots: IDot[] = [];
            const classes: string[] = [];

            if (file) {
                dots.push({
                    className: "hola",
                    color: "default",
                    isFilled: true,
                });
            }

            return {
                classes,
                dots,
            };
        },
        async getWeeklyMetadata(date) {
            const file = app.vault
                .getMarkdownFiles()
                .find((f) => date.isSame(f.stat.ctime, "week"));

            const dots: IDot[] = [];
            const classes: string[] = [];

            if (file) {
                dots.push({
                    className: "hola",
                    color: "default",
                    isFilled: true,
                });
            }

            return {
                classes,
                dots,
            };
        },
    };
}
