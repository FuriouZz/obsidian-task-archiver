import { useEffect, useRef } from "preact/hooks";
import { Calendar as Cal } from "obsidian-calendar-ui";
// import { useApp } from "contexts/ViewContext";

export default function Calendar() {
  // const app = useApp();
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const cal = new Cal({
      target: elRef.current,
      props: {
        showWeekNums: true,
        // sources: app.vault.getMarkdownFiles().map(() => {
        //   return {
        //     getDailyMetadata() {

        //     },
        //     getWeeklyMetadata() {

        //     }
        //   }
        // })
      },
    });

    return () => cal.$destroy();
  }, []);

  return <div ref={elRef}></div>;
}
