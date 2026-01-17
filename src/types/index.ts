// TypeScript type definitions for Amebo

// ===========================================
// USER & AUTH
// ===========================================
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  subscriptionTier: SubscriptionTier;
  aiUsageCount: number;
  aiUsageResetAt: Date | null;
  createdAt: Date;
}

export type SubscriptionTier = 'free' | 'pro' | 'team' | 'enterprise';

// ===========================================
// NOTES
// ===========================================
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  summary: string | null;
  folderId: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: Tag[];
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  parentId: string | null;
  createdAt: Date;
  notes?: Note[];
  children?: Folder[];
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string | null;
  createdAt: Date;
}

// ===========================================
// AI
// ===========================================
export type AIProvider = 'openai' | 'gemini' | 'anthropic' | 'grok';

export interface AISummaryResult {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
}

export interface AIOrganizationResult {
  suggestedFolder: string | null;
  suggestedTags: string[];
  topics: string[];
}

export interface AISearchResult {
  noteId: string;
  title: string;
  relevanceScore: number;
  matchedContent: string;
}

// ===========================================
// PAYMENTS
// ===========================================
export type PaymentProvider = 'stripe' | 'paystack';

export interface CheckoutSession {
  id: string;
  url: string;
  provider: PaymentProvider;
}

export interface Subscription {
  id: string;
  userId: string;
  provider: PaymentProvider;
  providerId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

// ===========================================
// API RESPONSES
// ===========================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===========================================
// ADMIN SETTINGS
// ===========================================
export interface AdminSettings {
  activeAIProvider: AIProvider;
  activePaymentProvider: PaymentProvider;
  stripeEnabled: boolean;
  paystackEnabled: boolean;
  openaiEnabled: boolean;
  geminiEnabled: boolean;
  anthropicEnabled: boolean;
  grokEnabled: boolean;
}
