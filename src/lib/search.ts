import { getLessons, getQuarter } from "./lessonAdapter";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function searchSite(query: string) {
  const term = normalize(query.trim());
  if (!term) return [];

  const lessons = getLessons().flatMap((lesson) => {
    const lessonHaystack = normalize(`${lesson.title} ${lesson.summary ?? ""} ${lesson.dateRange}`);
    const lessonResult = lessonHaystack.includes(term)
      ? [
          {
            type: "Lección",
            title: lesson.title,
            description: lesson.summary ?? lesson.dateRange,
            href: lesson.days.length > 0 ? `/lecciones/${lesson.id}` : "#",
          },
        ]
      : [];

    const dayResults = lesson.days
      .filter((day) =>
        normalize(`${day.dayName} ${day.title} ${day.contentMarkdown ?? ""}`).includes(term),
      )
      .map((day) => ({
        type: "Día",
        title: `${day.dayName}: ${day.title}`,
        description: lesson.title,
        href: `/lecciones/${lesson.id}/${day.id}`,
      }));

    return [...lessonResult, ...dayResults];
  });

  const quarter = getQuarter();
  const quarterMatch = normalize(`${quarter.title} ${quarter.description}`).includes(term)
    ? [
        {
          type: "Trimestre",
          title: quarter.title,
          description: quarter.description,
          href: "/",
        },
      ]
    : [];

  return [...quarterMatch, ...lessons].slice(0, 12);
}
