import type { ActivityType } from "@/types/database";

// Keywords and patterns for different activity types
const CATEGORIZATION_RULES: Record<ActivityType, {
  keywords: string[];
  patterns: RegExp[];
  contextWords: string[];
}> = {
  lunch: {
    keywords: ["lunch", "brunch", "breakfast", "café", "restaurant", "diner", "bistro"],
    patterns: [
      /lunch\s+(at|with|meeting)/i,
      /breakfast\s+(with|meeting)/i,
      /brunch\s+(at|with)/i,
    ],
    contextWords: ["eat", "food", "menu", "table", "reservation", "meal", "coffee", "sandwich"],
  },
  dinner: {
    keywords: ["dinner", "supper", "evening", "drinks", "cocktails", "bar", "wine"],
    patterns: [
      /dinner\s+(at|with|meeting)/i,
      /drinks\s+(with|at)/i,
      /cocktails?\s+(at|with)/i,
      /evening\s+(with|meeting)/i,
    ],
    contextWords: ["restaurant", "evening", "wine", "cocktail", "bar", "appetizer", "dessert"],
  },
  golf: {
    keywords: ["golf", "course", "tee", "round", "country club", "clubhouse"],
    patterns: [
      /golf\s+(round|game|outing)/i,
      /\d+\s+holes?/i,
      /(country\s+club|golf\s+course)/i,
    ],
    contextWords: ["par", "birdie", "eagle", "fairway", "green", "caddy", "cart", "clubhouse"],
  },
  meeting: {
    keywords: ["meeting", "conference", "workshop", "session", "presentation", "demo"],
    patterns: [
      /meeting\s+(with|about)/i,
      /conference\s+(call|room)/i,
      /(quarterly|monthly|weekly)\s+meeting/i,
      /(demo|presentation)\s+(of|about)/i,
    ],
    contextWords: ["agenda", "discuss", "strategy", "project", "proposal", "contract", "review"],
  },
  call: {
    keywords: ["call", "phone", "zoom", "teams", "skype", "facetime", "video call"],
    patterns: [
      /(phone|video)\s+call/i,
      /(zoom|teams|skype|facetime)\s+(call|meeting)/i,
      /called?\s+(about|regarding)/i,
    ],
    contextWords: ["discuss", "chat", "conversation", "follow-up", "check-in", "update"],
  },
  email: {
    keywords: ["email", "message", "correspondence", "follow-up", "follow up"],
    patterns: [
      /email\s+(exchange|thread)/i,
      /follow[\s-]?up\s+email/i,
      /sent?\s+(email|message)/i,
    ],
    contextWords: ["reply", "response", "attachment", "subject", "thread", "correspondence"],
  },
  other: {
    keywords: ["event", "networking", "conference", "trade show", "party"],
    patterns: [
      /networking\s+event/i,
      /(trade\s+show|conference|expo)/i,
      /company\s+(party|event)/i,
    ],
    contextWords: ["networking", "event", "expo", "conference", "seminar", "workshop"],
  },
};

// Expense categories for smart categorization
export const EXPENSE_CATEGORIZATION_RULES: Record<string, {
  keywords: string[];
  patterns: RegExp[];
  contextWords: string[];
}> = {
  meals: {
    keywords: ["lunch", "dinner", "breakfast", "brunch", "restaurant", "café", "food"],
    patterns: [
      /(lunch|dinner|breakfast|brunch)\s+(bill|check|tab)/i,
      /restaurant\s+(bill|expense)/i,
      /meal\s+(for|expense)/i,
    ],
    contextWords: ["tip", "gratuity", "menu", "table", "reservation", "waiter", "server"],
  },
  entertainment: {
    keywords: ["golf", "drinks", "cocktails", "bar", "club", "entertainment", "show", "tickets"],
    patterns: [
      /golf\s+(fees?|green\s+fees?)/i,
      /(drinks|cocktails?)\s+(tab|bill)/i,
      /(tickets?|show|entertainment)\s+(cost|expense)/i,
    ],
    contextWords: ["round", "green fees", "cart rental", "caddy", "show", "theater", "concert"],
  },
  travel: {
    keywords: ["flight", "hotel", "uber", "taxi", "airfare", "lodging", "accommodation"],
    patterns: [
      /(flight|airfare)\s+(cost|expense)/i,
      /(hotel|lodging)\s+(bill|expense)/i,
      /(uber|taxi|rideshare)\s+(fare|cost)/i,
    ],
    contextWords: ["airport", "airline", "booking", "reservation", "mileage", "gas", "parking"],
  },
  gifts: {
    keywords: ["gift", "present", "flowers", "wine", "bottle", "thank you"],
    patterns: [
      /(gift|present)\s+(for|to)/i,
      /(flowers|wine|champagne)\s+(for|as)/i,
      /thank\s+you\s+(gift|card)/i,
    ],
    contextWords: ["appreciation", "holiday", "birthday", "congratulations", "thank you"],
  },
  office: {
    keywords: ["office", "supplies", "equipment", "software", "subscription", "tools"],
    patterns: [
      /office\s+(supplies|equipment)/i,
      /(software|subscription)\s+(cost|fee)/i,
      /(equipment|tools)\s+(purchase|rental)/i,
    ],
    contextWords: ["business", "work", "professional", "productivity", "license", "monthly"],
  },
};

// Venue suggestions based on common business locations
export const VENUE_SUGGESTIONS: Record<string, string[]> = {
  lunch: [
    "The Capital Grille",
    "Morton's The Steakhouse",
    "Ruth's Chris Steak House",
    "Nobu",
    "The Four Seasons",
    "Le Bernardin",
    "Per Se",
    "Daniel",
    "Blue Hill",
    "Gramercy Tavern",
  ],
  dinner: [
    "Le Bernardin",
    "Per Se",
    "Eleven Madison Park",
    "Daniel",
    "Jean-Georges",
    "The Modern",
    "Alinea",
    "The French Laundry",
    "Babbo",
    "Union Square Cafe",
  ],
  golf: [
    "Pebble Beach Golf Links",
    "Augusta National Golf Club",
    "Pine Valley Golf Club",
    "Cypress Point Club",
    "Winged Foot Golf Club",
    "Oakmont Country Club",
    "Bethpage Black",
    "TPC Sawgrass",
    "Shadow Creek",
    "Whistling Straits",
  ],
  meeting: [
    "Company Conference Room A",
    "WeWork - Downtown",
    "Regus Business Center",
    "The Plaza Hotel - Oak Room",
    "Ritz Carlton - Executive Lounge",
    "Four Seasons - Boardroom",
    "Client Office",
    "Our Office",
    "Coffee Shop Meeting",
    "Hotel Lobby",
  ],
};

export interface CategorySuggestion {
  activityType: ActivityType;
  confidence: number;
  reasons: string[];
}

export interface ExpenseCategorySuggestion {
  category: string;
  confidence: number;
  reasons: string[];
}

export interface SmartSuggestions {
  activityType?: CategorySuggestion;
  expenseCategory?: ExpenseCategorySuggestion;
  venues?: string[];
  estimatedDuration?: number;
  estimatedExpense?: {
    amount: number;
    category: string;
    confidence: number;
  };
}

/**
 * Analyzes activity text and returns smart suggestions for categorization
 */
export function analyzeActivityText(
  title: string,
  notes: string = "",
  existingActivities: Array<{ title: string; activity_type: ActivityType; duration_minutes: number }> = []
): SmartSuggestions {
  const fullText = `${title} ${notes}`.toLowerCase();
  const suggestions: SmartSuggestions = {};

  // Analyze activity type
  const activitySuggestion = suggestActivityType(fullText);
  if (activitySuggestion) {
    suggestions.activityType = activitySuggestion;
  }

  // Analyze expense category
  const expenseSuggestion = suggestExpenseCategory(fullText);
  if (expenseSuggestion) {
    suggestions.expenseCategory = expenseSuggestion;
  }

  // Suggest venues
  if (suggestions.activityType) {
    suggestions.venues = VENUE_SUGGESTIONS[suggestions.activityType.activityType]?.slice(0, 5) || [];
  }

  // Estimate duration based on activity type and historical data
  suggestions.estimatedDuration = estimateDuration(
    suggestions.activityType?.activityType || "meeting",
    existingActivities
  );

  // Estimate expense amount
  suggestions.estimatedExpense = estimateExpenseAmount(
    suggestions.activityType?.activityType || "meeting",
    suggestions.expenseCategory?.category,
    existingActivities
  );

  return suggestions;
}

function suggestActivityType(text: string): CategorySuggestion | null {
  const scores: Record<ActivityType, { score: number; reasons: string[] }> = {
    lunch: { score: 0, reasons: [] },
    dinner: { score: 0, reasons: [] },
    golf: { score: 0, reasons: [] },
    meeting: { score: 0, reasons: [] },
    call: { score: 0, reasons: [] },
    email: { score: 0, reasons: [] },
    other: { score: 0, reasons: [] },
  };

  // Score each activity type based on keywords, patterns, and context
  Object.entries(CATEGORIZATION_RULES).forEach(([activityType, rules]) => {
    const type = activityType as ActivityType;
    
    // Check keywords (high weight)
    rules.keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scores[type].score += 3;
        scores[type].reasons.push(`Contains keyword: "${keyword}"`);
      }
    });

    // Check patterns (very high weight)
    rules.patterns.forEach(pattern => {
      if (pattern.test(text)) {
        scores[type].score += 5;
        scores[type].reasons.push(`Matches pattern: ${pattern.source}`);
      }
    });

    // Check context words (medium weight)
    rules.contextWords.forEach(contextWord => {
      if (text.includes(contextWord)) {
        scores[type].score += 1;
        scores[type].reasons.push(`Contains context word: "${contextWord}"`);
      }
    });
  });

  // Find the highest scoring activity type
  const sortedScores = Object.entries(scores)
    .filter(([_, data]) => data.score > 0)
    .sort(([,a], [,b]) => b.score - a.score);

  if (sortedScores.length === 0) return null;

  const [topType, topData] = sortedScores[0];
  const confidence = Math.min(topData.score / 10 * 100, 95); // Max 95% confidence

  return {
    activityType: topType as ActivityType,
    confidence,
    reasons: topData.reasons.slice(0, 3), // Top 3 reasons
  };
}

function suggestExpenseCategory(text: string): ExpenseCategorySuggestion | null {
  const scores: Record<string, { score: number; reasons: string[] }> = {};

  Object.entries(EXPENSE_CATEGORIZATION_RULES).forEach(([category, rules]) => {
    scores[category] = { score: 0, reasons: [] };
    
    // Check keywords
    rules.keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        scores[category].score += 3;
        scores[category].reasons.push(`Contains keyword: "${keyword}"`);
      }
    });

    // Check patterns
    rules.patterns.forEach(pattern => {
      if (pattern.test(text)) {
        scores[category].score += 5;
        scores[category].reasons.push(`Matches pattern`);
      }
    });

    // Check context words
    rules.contextWords.forEach(contextWord => {
      if (text.includes(contextWord)) {
        scores[category].score += 1;
        scores[category].reasons.push(`Contains context: "${contextWord}"`);
      }
    });
  });

  const sortedScores = Object.entries(scores)
    .filter(([_, data]) => data.score > 0)
    .sort(([,a], [,b]) => b.score - a.score);

  if (sortedScores.length === 0) return null;

  const [topCategory, topData] = sortedScores[0];
  const confidence = Math.min(topData.score / 8 * 100, 95);

  return {
    category: topCategory,
    confidence,
    reasons: topData.reasons.slice(0, 3),
  };
}

function estimateDuration(
  activityType: ActivityType,
  existingActivities: Array<{ title: string; activity_type: ActivityType; duration_minutes: number }>
): number {
  // Default durations by activity type
  const defaultDurations: Record<ActivityType, number> = {
    lunch: 90,
    dinner: 120,
    golf: 240,
    meeting: 60,
    call: 30,
    email: 15,
    other: 60,
  };

  // Calculate average duration from historical data
  const similarActivities = existingActivities.filter(a => a.activity_type === activityType);
  
  if (similarActivities.length >= 3) {
    const avgDuration = similarActivities.reduce((sum, a) => sum + a.duration_minutes, 0) / similarActivities.length;
    return Math.round(avgDuration);
  }

  return defaultDurations[activityType];
}

function estimateExpenseAmount(
  activityType: ActivityType,
  expenseCategory: string | undefined,
  existingActivities: Array<any>
): { amount: number; category: string; confidence: number } | undefined {
  if (!expenseCategory) return undefined;

  // Default expense amounts by activity type and category
  const expenseEstimates: Record<ActivityType, Record<string, number>> = {
    lunch: { meals: 150, entertainment: 75 },
    dinner: { meals: 250, entertainment: 100 },
    golf: { entertainment: 200, meals: 100 },
    meeting: { meals: 50, office: 25 },
    call: {},
    email: {},
    other: { entertainment: 100, meals: 75 },
  };

  const estimate = expenseEstimates[activityType]?.[expenseCategory];
  if (!estimate) return undefined;

  return {
    amount: estimate,
    category: expenseCategory,
    confidence: 70,
  };
}

/**
 * Learn from user corrections to improve future suggestions
 */
export function recordUserCorrection(
  originalText: string,
  suggestedType: ActivityType,
  actualType: ActivityType,
  suggestedCategory?: string,
  actualCategory?: string
) {
  // In a real implementation, this would store corrections in localStorage
  // or send to an API endpoint to improve the model
  const correction = {
    text: originalText,
    suggested: { type: suggestedType, category: suggestedCategory },
    actual: { type: actualType, category: actualCategory },
    timestamp: new Date().toISOString(),
  };

  const corrections = getStoredCorrections();
  corrections.push(correction);
  
  // Keep only the last 100 corrections
  const recentCorrections = corrections.slice(-100);
  localStorage.setItem('smart-categorization-corrections', JSON.stringify(recentCorrections));
}

function getStoredCorrections() {
  try {
    const stored = localStorage.getItem('smart-categorization-corrections');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}