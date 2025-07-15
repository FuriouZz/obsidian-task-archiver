import type { Signal } from "@preact/signals";
import type { NoteListEntry } from "types";

export interface INoteListProps {
    entries: Signal<NoteListEntry[]>;
    onOpenEntry: (entry: NoteListEntry) => void;
}

export default function NoteList(props: INoteListProps) {
    return (
        <ul>
            {props.entries.value.map((entry) => {
                return (
                    <li key={entry.filename}>
                        {/** biome-ignore lint/a11y/useValidAnchor: well that's ok */}
                        <a href="#" onClick={() => props.onOpenEntry(entry)}>
                            {entry.title}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}
