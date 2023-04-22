import { useEffect, useRef } from "preact/hooks";
import { Calendar as Cal } from "obsidian-calendar-ui";

export default function Calendar() {
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const cal = new Cal({
      target: elRef.current,
      props: {
        // Settings
        showWeekNums: false,
      },
    });

    return () => cal.$destroy();
  }, []);

  return <div ref={elRef}></div>;
}
