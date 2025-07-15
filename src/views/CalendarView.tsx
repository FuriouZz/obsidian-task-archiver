import { ItemView, type WorkspaceLeaf } from "obsidian";
import { render } from "preact";
import Calendar from "components/Calendar/Calendar";
import {
    CALENDAR_ICON,
    CALENDAR_TITLE,
    CALENDAR_VIEW_TYPE,
} from "constants.js";
import { createCalendarStore } from "stores/CalendarStore";
import { createNoteSource } from "sources/NoteSource";
import NoteList from "components/NoteList/NoteList";
import type { NoteListEntry } from "types";

export default class CalendarView extends ItemView {
    calendarStore = createCalendarStore(this.app);

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);

        this.onClickDay = this.onClickDay.bind(this);
        this.onClickWeek = this.onClickWeek.bind(this);
        this.onOpenEntry = this.onOpenEntry.bind(this);

        this.registerEvent(
            this.app.vault.on("create", this.calendarStore.refresh),
        );
        this.registerEvent(
            this.app.vault.on("delete", this.calendarStore.refresh),
        );
        this.registerEvent(
            this.app.vault.on("modify", this.calendarStore.refresh),
        );
    }

    getViewType(): string {
        return CALENDAR_VIEW_TYPE;
    }

    getDisplayText(): string {
        return CALENDAR_TITLE;
    }

    getIcon(): string {
        return CALENDAR_ICON;
    }

    protected async onOpen() {
        const sources = [createNoteSource(this.app)];

        render(
            <>
                <Calendar
                    showWeekNums
                    activeDay={this.calendarStore.date}
                    granularity={this.calendarStore.granularity}
                    sources={sources}
                    onClickDay={this.onClickDay}
                    onClickWeek={this.onClickWeek}
                />
                <NoteList
                    entries={this.calendarStore.entries}
                    onOpenEntry={this.onOpenEntry}
                />
            </>,
            this.contentEl,
        );
    }

    async onClose() {
        // Nothing to clean up.
    }

    onClickDay(day: moment.Moment) {
        this.calendarStore.granularity.value = "day";
        this.calendarStore.date.value = day;
    }

    onClickWeek(day: moment.Moment) {
        this.calendarStore.granularity.value = "week";
        this.calendarStore.date.value = day;
    }

    onOpenEntry(entry: NoteListEntry) {
        const leaf = this.app.workspace.getLeaf(false);
        leaf.openFile(entry.file);
    }
}
