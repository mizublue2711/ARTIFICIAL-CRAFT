/**
 * ARTIFICIAL CRAFT // SHOWCASE SCHEMA SPECIFICATION
 * Strict zero-trust contract for 6-point [PROJECT DEBRIEF] cards
 *
 * Implements architectural constraints from AGENT.md:
 * - Isolated types in src/types/
 * - Zero-trust type safety with strict compiler flags
 */

export interface ProjectBehindTheScenes {
  strategicAngle: string;
  technicalAngle: string;
  deliverableAngle: string;
}

export interface ProjectMedia {
  heroBannerUrl: string;
  featureImages: string[];
  youtubeEmbedUrl?: string;
}

export interface ProjectLinks {
  liveUrl: string;
}

export interface ShowcaseProject {
  id: string; // slug
  title: string;
  tags: string[];
  dateText: string; // e.g. "Nov 2026"
  impressiveMetric: string;
  about: string;
  contextObstacle: string; // Bối cảnh & Bài toán
  technicalObstacle: string; // Trở ngại kỹ thuật
  coreSolution: string; // Giải pháp cốt lõi
  behindTheScenes: ProjectBehindTheScenes;
  media: ProjectMedia;
  links: ProjectLinks;
  hidden?: boolean;
}

export interface ShowcaseProjectDebrief {
  title: string;
  about: string;
  impressiveMetric: string;
  contextObstacle: string;
  technicalObstacle: string;
  coreSolution: string;
  behindTheScenes: ProjectBehindTheScenes;
}

export interface ShowcaseTranslations {
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  badgeOperational: string;
  contextObstacle: string;
  technicalObstacle: string;
  coreSolution: string;
  behindTheScenes: string;
  strategy: string;
  execution: string;
  impact: string;
  launchLiveApp: string;
  viewDemo: string;
  metricLabel: string;
  debriefTag: string;
  projects: Record<string, ShowcaseProjectDebrief>;
}
