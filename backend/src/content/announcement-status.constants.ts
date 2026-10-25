export const AnnouncementStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

export const ANNOUNCEMENT_STATUSES = ['draft', 'published'] as const;

export type AnnouncementStatus = (typeof ANNOUNCEMENT_STATUSES)[number];
