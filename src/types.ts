export type TabId = "about" | "publications" | "experience" | "honors";

export interface TabItem {
  id: TabId;
  name: string;
}

export interface LinkItem {
  type: string;
  url: string;
}

export interface QuickLink {
  name: string;
  url: string;
}

export interface Interest {
  uid: string;
  title: string;
  description: string;
}

export interface Profile {
  name: string;
  cnName: string;
  title: string;
  affiliation: string;
  school: string;
  email: string;
  bio: string;
  interests: Interest[];
  scholarStats: {
    citations: string;
    hIndex: string;
    i10Index: string;
    updatedAt: string;
  };
}

export interface NewsItem {
  uid: string;
  date: string;
  content: string;
}

export interface Publication {
  uid: string;
  featured?: boolean;
  title: string;
  authors: string;
  firstAuthors?: string;
  correspondingAuthors?: string;
  venue: string;
  year: string;
  tag: string;
  links: LinkItem[];
}

export interface Project {
  uid: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  links: LinkItem[];
}

export interface TimelineItem {
  uid: string;
  title: string;
  subtitle: string;
  period: string;
  details: string;
}

export interface AwardItem {
  uid: string;
  title: string;
  organization: string;
  year: string;
}

export interface ServiceItem {
  uid: string;
  title: string;
  organization: string;
  year: string;
}

export interface SiteData {
  profile: Profile;
  quickLinks: QuickLink[];
  newsItems: NewsItem[];
  publications: Publication[];
  projects: Project[];
  education: TimelineItem[];
  experience: TimelineItem[];
  awards: AwardItem[];
  services: ServiceItem[];
  authorLinks: Record<string, string>;
}
