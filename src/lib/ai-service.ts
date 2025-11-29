import { prisma } from './prisma';

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  tokensUsed?: number;
}

class AIService {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.AI_PROVIDER_API_KEY || '';
    this.baseUrl = process.env.AI_PROVIDER_BASE_URL || 'https://api.openai.com/v1';
    this.model = process.env.AI_MODEL || 'gpt-4-turbo-preview';
  }

  private async makeRequest(
    messages: Array<{ role: string; content: string }>,
    userId: string,
    workspaceId: string,
    requestType: string
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const tokensUsed = data.usage?.total_tokens || 0;
      const costEstimate = (tokensUsed / 1000) * 0.01;

      // Log the request
      await prisma.aIRequestLog.create({
        data: {
          userId,
          workspaceId,
          model: this.model,
          tokensUsed,
          costEstimate,
          success: true,
          requestType,
        },
      });

      // Update AI calls used
      await prisma.subscription.update({
        where: { workspaceId },
        data: { aiCallsUsed: { increment: 1 } },
      });

      return {
        success: true,
        data: data.choices[0].message.content,
        tokensUsed,
      };
    } catch (error: any) {
      // Log the error
      await prisma.aIRequestLog.create({
        data: {
          userId,
          workspaceId,
          model: this.model,
          success: false,
          errorMessage: error.message,
          requestType,
        },
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async generateRepurposedContent(
    originalText: string,
    platforms: string[],
    userId: string,
    workspaceId: string
  ): Promise<AIResponse> {
    const systemPrompt = `You are a content repurposing expert. Given original content, create platform-specific variations.
Return a JSON object with this structure:
{
  "hooks": ["hook1", "hook2", "hook3"],
  "captions": {
    "YOUTUBE": "caption for youtube",
    "INSTAGRAM": "caption for instagram",
    "LINKEDIN": "caption for linkedin",
    "TIKTOK": "caption for tiktok"
  },
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}`;

    const userPrompt = `Repurpose this content for ${platforms.join(', ')}:\n\n${originalText}`;

    const response = await this.makeRequest(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      userId,
      workspaceId,
      'content_repurposing'
    );

    if (response.success && response.data) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        // If parsing fails, return raw data
      }
    }

    return response;
  }

  async generateFollowupEmail(
    dealContext: {
      dealName: string;
      sponsorName: string;
      status: string;
      notes?: string;
    },
    userId: string,
    workspaceId: string
  ): Promise<AIResponse> {
    const systemPrompt = `You are a professional business development expert. Generate a friendly but professional follow-up email for a sponsorship deal.
Keep it concise (150-200 words), personalized, and action-oriented.`;

    const userPrompt = `Generate a follow-up email for:
Deal: ${dealContext.dealName}
Sponsor: ${dealContext.sponsorName}
Current Status: ${dealContext.status}
${dealContext.notes ? `Notes: ${dealContext.notes}` : ''}`;

    return this.makeRequest(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      userId,
      workspaceId,
      'followup_email'
    );
  }

  async generateDailySummaryAndSuggestions(
    workspaceData: {
      contentCount: number;
      scheduledCount: number;
      dealsCount: number;
      recentActivity: string;
    },
    userId: string,
    workspaceId: string
  ): Promise<AIResponse> {
    const systemPrompt = `You are an AI business operations assistant. Analyze workspace data and provide 2-3 actionable suggestions.
Return a JSON object with:
{
  "summary": "brief summary of current state",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}`;

    const userPrompt = `Analyze this workspace:
- Content items: ${workspaceData.contentCount}
- Scheduled posts: ${workspaceData.scheduledCount}
- Active deals: ${workspaceData.dealsCount}
- Recent activity: ${workspaceData.recentActivity}`;

    const response = await this.makeRequest(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      userId,
      workspaceId,
      'daily_summary'
    );

    if (response.success && response.data) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        // If parsing fails, return raw data
      }
    }

    return response;
  }
}

export const aiService = new AIService();