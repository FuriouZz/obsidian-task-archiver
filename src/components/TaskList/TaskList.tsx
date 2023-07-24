import { Signal } from "@preact/signals";
import { TaskListEntry } from "types";

export interface ITaskListProps {
  entries: Signal<TaskListEntry[]>;
  onOpenEntry: (entry: TaskListEntry) => void;
}

export default function TaskList(props: ITaskListProps) {
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
