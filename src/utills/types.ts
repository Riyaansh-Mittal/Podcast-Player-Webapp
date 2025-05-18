export type Chapter = {
  title: string;
  time: string;
};

export type Episode = {
  id: string;
  title: string;
  number: number;
  duration: string;
  date: string;
  description: string;
  audioUrl: string;
  thumbnailUrl: string;
  chapters: Chapter[];
};

export type PodcastSeries = {
  id: string;
  title: string;
  author: string;
  description: string;
  categories: string[];
  totalEpisodes: number;
  thumbnailUrl: string;
};
