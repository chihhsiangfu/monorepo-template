export type TestType = {
  name: string;
};

export type Item = {
  id: string;
  title: string;
  description: string;
  category: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

export type Project = {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  data: Record<string, any>;
  metadata: Record<string, any>;
  publicType: "private" | "everyone_can_view" | "everyone_can_edit";
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
