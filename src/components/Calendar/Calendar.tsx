import { useEffect, useRef } from "preact/hooks";
import { Calendar as Cal, IDot } from "obsidian-calendar-ui";
import { useApp } from "contexts/ViewContext";

export default function Calendar() {
  const app = useApp();
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!elRef.current) return;

    const files = app.vault.getMarkdownFiles();

    const cal = new Cal({
      target: elRef.current,
      props: {
        showWeekNums: true,
        onClickDay(day) {
          console.log(files.filter((f) => day.isSame(f.stat.ctime, "day")));
        },
        sources: [
          {
            async getDailyMetadata(date) {
              const file = files.find((f) => date.isSame(f.stat.ctime, "day"));
              const dots: IDot[] = [];

              if (file) {
                dots.push({
                  className: "hola",
                  color: "default",
                  isFilled: true,
                });
              }

              return { dots };
            },
            async getWeeklyMetadata() {
              return {};
            },
          },
        ],
      },
    });

    return () => cal.$destroy();
  }, []);

  return <div ref={elRef}></div>;
}
