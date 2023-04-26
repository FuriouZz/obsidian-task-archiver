import { Signal } from "@preact/signals";
import { ListEntry } from "types";

export interface IListProps {
  entries: Signal<ListEntry[]>;
  onOpenEntry: (entry: ListEntry) => void;
}

export default function List(props: IListProps) {
  return (
    <ul>
      {props.entries.value.map((entry) => {
        return (
          <li key={entry.filename}>
            <a href="#" onClick={() => props.onOpenEntry(entry)}>
              {entry.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
