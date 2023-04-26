import { useEffect, useRef, useState } from "preact/hooks";
import { Calendar as CalendarModel } from "obsidian-calendar-ui";
import { getDateUID } from "obsidian-daily-notes-interface";
import { SvelteComponentTyped } from "svelte";
import { Signal, effect } from "@preact/signals";

type CalendarModelProps = CalendarModel extends SvelteComponentTyped<infer U>
  ? U
  : unknown;

export interface CalendarProps extends Omit<CalendarModelProps, "selectedId"> {
  activeDay: Signal<moment.Moment | undefined>;
}

export default function Calendar({ activeDay, ...props }: CalendarProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [calendar, setCalendar] = useState<CalendarModel>();

  useEffect(() => {
    const target = elRef.current;
    if (!target) return;

    const cal = new CalendarModel({ target, props });
    setCalendar(cal);
    return () => cal.$destroy();
  }, []);

  effect(() => {
    const day = activeDay.value;
    if (!day) return;

    calendar?.$set({ selectedId: getDateUID(day, "day") });
  });

  return <div ref={elRef}></div>;
}
