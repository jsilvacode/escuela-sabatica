export type ResourceType =
  | "pdf"
  | "ppt"
  | "audio"
  | "video"
  | "article"
  | "commentary"
  | "guide";

export type Resource = {
  id: string;
  type: ResourceType;
  title: string;
  description?: string;
  url: string;
  duration?: string;
  fileSize?: string;
  thumbnail?: string;
  external?: boolean;
};

export type AudioResource = {
  title: string;
  url: string;
  duration?: string;
  narrator?: string;
};
