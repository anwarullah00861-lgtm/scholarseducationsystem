import { ContentService } from './content.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ContentService', () => {
  let service: ContentService;

  const prisma = {
    announcement: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ContentService(prisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('persists a new announcement with the draft default', async () => {
      const created = { id: 'new-1', title: 'Open day', body: 'Join us on campus.', status: 'draft' };
      prisma.announcement.create.mockResolvedValue(created);

      const result = await service.create({
        title: 'Open day',
        body: 'Join us on campus.',
      });

      expect(result).toEqual(created);
      expect(prisma.announcement.create).toHaveBeenCalledWith({
        data: { title: 'Open day', body: 'Join us on campus.', status: 'draft' },
      });
    });

    it('passes an explicit status through', async () => {
      prisma.announcement.create.mockResolvedValue({ id: 'new-2', status: 'published' });

      await service.create({ title: 'Results day', body: 'Results published today.', status: 'published' as never });

      expect(prisma.announcement.create).toHaveBeenCalledWith({
        data: { title: 'Results day', body: 'Results published today.', status: 'published' },
      });
    });
  });

  describe('findAll', () => {
    it('lists announcements newest first', async () => {
      const rows = [{ id: '1', title: 'Term starts' }];
      prisma.announcement.findMany.mockResolvedValue(rows);

      const result = await service.findAll();

      expect(result).toEqual(rows);
      expect(prisma.announcement.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('filters by status when provided', async () => {
      prisma.announcement.findMany.mockResolvedValue([]);

      await service.findAll('published');

      expect(prisma.announcement.findMany).toHaveBeenCalledWith({
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('returns a single announcement by id', async () => {
      prisma.announcement.findUnique.mockResolvedValue({ id: '1' });

      const result = await service.findOne('1');

      expect(result).toEqual({ id: '1' });
      expect(prisma.announcement.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('update', () => {
    it('updates only the provided fields', async () => {
      prisma.announcement.update.mockResolvedValue({ id: '1', title: 'Updated' });

      await service.update('1', { title: 'Updated' });

      expect(prisma.announcement.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: 'Updated' },
      });
    });
  });

  describe('remove', () => {
    it('deletes the announcement', async () => {
      prisma.announcement.delete.mockResolvedValue({ id: '1' });

      await service.remove('1');

      expect(prisma.announcement.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
