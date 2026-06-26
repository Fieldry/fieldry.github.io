import type { ServiceItem } from "../types";

interface CourseService {
  name: string;
  year: string;
}

interface ConferenceService {
  uid: string;
  name: string;
  year: string;
}

const teachingAssistantCourses: CourseService[] = [
  { name: "Data Structures and Programming", year: "2022 - 2023" },
  { name: "Discrete Mathematics", year: "2022 - 2023" },
  { name: "Computer Hardware Fundamentals", year: "2022 - 2023" },
];

// Add new reviewing service here, e.g.
// { uid: "iclr-2027", name: "ICLR 2027", year: "2026" },
const reviewerConferences: ConferenceService[] = [
  { uid: "aaai-2026", name: "AAAI 2026", year: "2025" },
  { uid: "aaai-2027", name: "AAAI 2027", year: "2026" },
  { uid: "npjdm-2026", name: "npj Digital Medicine", year: "2026" },
  { uid: "npjhs-2026", name: "npj Health Systems", year: "2026" },
  { uid: "scientific-reports-2026", name: "Scientific Reports", year: "2026" },
];

export const services: ServiceItem[] = [
  {
    uid: "service-ta",
    title: "Teaching Assistant",
    organization: teachingAssistantCourses
      .map((course) => course.name)
      .join(", "),
    year: formatYearRange(teachingAssistantCourses),
  },
  ...reviewerConferences.map(
    (conference): ServiceItem => ({
      uid: `service-reviewer-${conference.uid}`,
      title: "Reviewer",
      organization: conference.name,
      year: conference.year,
    }),
  ),
];

function formatYearRange(items: Array<{ year: string }>) {
  const years = [...new Set(items.map((item) => item.year))];

  return years.join(", ");
}
