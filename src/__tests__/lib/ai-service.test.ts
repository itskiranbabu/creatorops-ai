import { aiService } from '@/lib/ai-service';

// Mock fetch
global.fetch = jest.fn();

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    aIRequestLog: {
      create: jest.fn(),
    },
    subscription: {
      update: jest.fn(),
    },
  },
}));

describe('AIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateRepurposedContent', () => {
    it('should generate repurposed content successfully', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                hooks: ['Hook 1', 'Hook 2'],
                captions: {
                  YOUTUBE: 'YouTube caption',
                  INSTAGRAM: 'Instagram caption',
                },
                hashtags: ['#creator', '#content'],
              }),
            },
          },
        ],
        usage: {
          total_tokens: 150,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.generateRepurposedContent(
        'Original content',
        ['YOUTUBE', 'INSTAGRAM'],
        'user_123',
        'workspace_456'
      );

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('hooks');
      expect(result.data).toHaveProperty('captions');
      expect(result.data).toHaveProperty('hashtags');
    });

    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      const result = await aiService.generateRepurposedContent(
        'Original content',
        ['YOUTUBE'],
        'user_123',
        'workspace_456'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('generateFollowupEmail', () => {
    it('should generate follow-up email successfully', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: 'Dear sponsor, following up on our discussion...',
            },
          },
        ],
        usage: {
          total_tokens: 100,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.generateFollowupEmail(
        {
          dealName: 'Test Deal',
          sponsorName: 'Test Sponsor',
          status: 'NEGOTIATION',
        },
        'user_123',
        'workspace_456'
      );

      expect(result.success).toBe(true);
      expect(typeof result.data).toBe('string');
      expect(result.data.length).toBeGreaterThan(0);
    });
  });
});