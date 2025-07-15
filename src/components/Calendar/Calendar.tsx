import { useEffect, useRef, useState } from "preact/hooks";
import { Calendar as CalendarModel } from "obsidian-calendar-ui";
import { type IGranularity, getDateUID } from "obsidian-daily-notes-interface";
import type { SvelteComponentTyped } from "svelte";
import { type Signal, effect } from "@preact/signals";

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: cannot track all props
	useEffect(() => {
		const target = elRef.current;
		if (!target) return;

		// @ts-ignore
		const cal = new CalendarModel({ target, props });
		setCalendar(cal);
		return () => cal.$destroy();
	}, []);

	effect(() => {
		const day = activeDay.value;
		if (!day) return;

		calendar?.$set({ selectedId: getDateUID(day, granularity.value) });
	});

	return <div ref={elRef} />;
}
