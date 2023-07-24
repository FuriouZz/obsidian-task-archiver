import { useEffect, useRef, useState } from "preact/hooks";
import { Calendar as CalendarModel } from "obsidian-calendar-ui";
import { IGranularity, getDateUID } from "obsidian-daily-notes-interface";
import { SvelteComponentTyped } from "svelte";
import { Signal, effect } from "@preact/signals";

type CalendarModelProps = CalendarModel extends SvelteComponentTyped<infer U>
  ? U
  : unknown;

export interface ICalendarProps extends Omit<CalendarModelProps, "selectedId"> {
  activeDay: Signal<moment.Moment | undefined>;
  granularity: Signal<IGranularity>;
}

export default function Calendar({
  activeDay,
  granularity,
  ...props
}: ICalendarProps) {
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

    calendar?.$set({ selectedId: getDateUID(day, granularity.value) });
  });

  return <div ref={elRef}></div>;
}
