export type CourseSection = {
  heading: string;
  paragraphs: string[];
};

export type CourseExample = {
  title: string;
  rows: Array<{ label: string; value: string }>;
  note: string;
};

export type CourseLesson = {
  slug: string;
  title: string;
  summary: string;
  track: string;
  minutes: number;
  image: string;
  imageAlt: string;
  videoId?: string;
  practice?: { label: string; to: string };
  sourceLabel: string;
  sourceUrl: string;
  sections: CourseSection[];
  example?: CourseExample;
};

export type CourseVideo = {
  id: string;
  title: string;
  channel: string;
  note: string;
};

export type Course = {
  id: string;
  base: string;
  eyebrow: string;
  title: string;
  lede: string;
  searchPlaceholder: string;
  heroImage: string;
  heroAlt: string;
  heroCaption: string;
  tracks: string[];
  path: string[];
  lessons: CourseLesson[];
  videos: CourseVideo[];
  terms: Array<{ term: string; meaning: string }>;
};

export function courseLesson(course: Course, slug: string) {
  return course.lessons.find((lesson) => lesson.slug === slug);
}

export function courseVideo(course: Course, id: string) {
  return course.videos.find((video) => video.id === id);
}
