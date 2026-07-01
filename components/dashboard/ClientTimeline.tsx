"use client";

import { useMemo } from "react";
import { 
  Calendar,
  Clock, 
  Coffee,
  DollarSign,
  FileText,
  Golf,
  Mail,
  MessageCircle,
  Phone,
  Target,
  TrendingUp,
  Utensils,
  Users
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format/currency";
import type { Client, Deal, Expense, Interaction, ActivityType } from "@/types/database";

// Activity type icons
const ACTIVITY_ICONS: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  lunch: Utensils,
  dinner: Utensils,
  golf: Golf,
  meeting: Users,
  call: Phone,
  email: Mail,
  other: MessageCircle,
};

// Timeline event types
type TimelineEvent = {
  id: string;
  type: 'interaction' | 'expense' | 'deal';
  date: Date;
  title: string;
  description?: string;
  metadata: {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badge?: string;
    amount?: number;
    duration?: number;
  };
  originalData: Interaction | Expense | Deal;
};

interface ClientTimelineProps {
  client: Client;
  interactions: Interaction[];
  expenses: Expense[];
  deals: Deal[];
}

export function ClientTimeline({ client, interactions, expenses, deals }: ClientTimelineProps) {
  // Combine and sort all events by date
  const timelineEvents = useMemo((): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    // Add interactions
    interactions.forEach((interaction) => {
      events.push({
        id: `interaction-${interaction.id}`,
        type: 'interaction',
        date: new Date(interaction.occurred_at),
        title: interaction.title,
        description: interaction.notes || undefined,
        metadata: {
          icon: ACTIVITY_ICONS[interaction.activity_type],
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          badge: interaction.activity_type,
          duration: interaction.duration_minutes,
        },
        originalData: interaction,
      });
    });

    // Add expenses
    expenses.forEach((expense) => {
      events.push({
        id: `expense-${expense.id}`,
        type: 'expense',
        date: new Date(expense.incurred_at),
        title: `${expense.category} expense`,
        description: expense.description || undefined,
        metadata: {
          icon: DollarSign,
          color: 'bg-red-100 text-red-700 border-red-200',
          badge: expense.category,
          amount: expense.amount_cents,
        },
        originalData: expense,
      });
    });

    // Add deal milestones
    deals.forEach((deal) => {
      // Deal created
      events.push({
        id: `deal-created-${deal.id}`,
        type: 'deal',
        date: new Date(deal.created_at),
        title: `New deal: ${deal.title}`,
        description: deal.notes || undefined,
        metadata: {
          icon: Target,
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          badge: 'deal created',
          amount: deal.amount_cents,
        },
        originalData: deal,
      });

      // Deal closed/lost
      if (deal.closed_at) {
        events.push({
          id: `deal-closed-${deal.id}`,
          type: 'deal',
          date: new Date(deal.closed_at),
          title: `Deal ${deal.status}: ${deal.title}`,
          description: deal.notes || undefined,
          metadata: {
            icon: deal.status === 'closed' ? TrendingUp : Target,
            color: deal.status === 'closed' 
              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
              : 'bg-gray-100 text-gray-700 border-gray-200',
            badge: deal.status,
            amount: deal.amount_cents,
          },
          originalData: deal,
        });
      }
    });

    // Sort by date (most recent first)
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [interactions, expenses, deals]);

  // Group events by month for better organization
  const groupedEvents = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    
    timelineEvents.forEach((event) => {
      const monthKey = event.date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(event);
    });

    return groups;
  }, [timelineEvents]);

  // Calculate relationship health metrics
  const relationshipHealth = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const recentInteractions = interactions.filter(i => 
      new Date(i.occurred_at) > thirtyDaysAgo
    );
    
    const quarterlyInteractions = interactions.filter(i => 
      new Date(i.occurred_at) > ninetyDaysAgo
    );

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount_cents, 0);
    const totalRevenue = deals
      .filter(d => d.status === 'closed')
      .reduce((sum, d) => sum + d.amount_cents, 0);
    
    const roi = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0;

    const lastInteraction = interactions.length > 0 
      ? interactions.reduce((latest, current) => 
          new Date(current.occurred_at) > new Date(latest.occurred_at) ? current : latest
        )
      : null;

    const daysSinceLastContact = lastInteraction 
      ? Math.floor((now.getTime() - new Date(lastInteraction.occurred_at).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    return {
      recentInteractions: recentInteractions.length,
      quarterlyInteractions: quarterlyInteractions.length,
      totalInvestment: totalSpent,
      totalRevenue,
      roi,
      daysSinceLastContact,
      healthScore: calculateHealthScore(recentInteractions.length, daysSinceLastContact, roi),
    };
  }, [interactions, expenses, deals]);

  function calculateHealthScore(recent: number, daysSince: number | null, roi: number): {
    score: number;
    label: string;
    color: string;
  } {
    let score = 50; // baseline

    // Recent activity bonus
    if (recent >= 3) score += 30;
    else if (recent >= 1) score += 15;
    else score -= 20;

    // Days since contact penalty
    if (daysSince !== null) {
      if (daysSince <= 7) score += 20;
      else if (daysSince <= 30) score += 10;
      else if (daysSince <= 90) score -= 10;
      else score -= 30;
    }

    // ROI bonus/penalty
    if (roi > 100) score += 20;
    else if (roi > 0) score += 10;
    else if (roi < -50) score -= 20;

    // Clamp to 0-100
    score = Math.max(0, Math.min(100, score));

    let label = 'Unknown';
    let color = 'bg-gray-100 text-gray-700';

    if (score >= 80) {
      label = 'Excellent';
      color = 'bg-emerald-100 text-emerald-700';
    } else if (score >= 60) {
      label = 'Good';
      color = 'bg-blue-100 text-blue-700';
    } else if (score >= 40) {
      label = 'Fair';
      color = 'bg-amber-100 text-amber-700';
    } else if (score >= 20) {
      label = 'Needs Attention';
      color = 'bg-orange-100 text-orange-700';
    } else {
      label = 'At Risk';
      color = 'bg-red-100 text-red-700';
    }

    return { score, label, color };
  }

  if (timelineEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-4 text-slate-500">No timeline events yet</p>
        <p className="text-sm text-slate-400">
          Start logging interactions, expenses, or deals to build the relationship timeline
        </p>
      </div>
    );
  }

  const health = relationshipHealth.healthScore;

  return (
    <div className="space-y-6">
      {/* Relationship Health Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Relationship Health</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={health.color}>
                  {health.label}
                </Badge>
                <span className="text-sm text-slate-600">
                  {health.score}/100
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Last Contact</p>
              <p className="font-semibold text-slate-900 mt-1">
                {relationshipHealth.daysSinceLastContact !== null
                  ? `${relationshipHealth.daysSinceLastContact} days ago`
                  : 'Never'
                }
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">30-Day Activity</p>
              <p className="font-semibold text-slate-900 mt-1">
                {relationshipHealth.recentInteractions} interactions
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">ROI</p>
              <p className={`font-semibold mt-1 ${
                relationshipHealth.roi > 0 
                  ? 'text-emerald-700' 
                  : relationshipHealth.roi < 0 
                    ? 'text-red-700' 
                    : 'text-slate-900'
              }`}>
                {relationshipHealth.roi > 0 ? '+' : ''}{relationshipHealth.roi.toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.entries(groupedEvents).map(([monthYear, events]) => (
          <div key={monthYear}>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              {monthYear}
            </h3>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
              
              <div className="space-y-6">
                {events.map((event, index) => {
                  const Icon = event.metadata.icon;
                  const isLast = index === events.length - 1;
                  
                  return (
                    <div key={event.id} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div className={`
                        flex-shrink-0 w-12 h-12 rounded-full border-2 ${event.metadata.color}
                        flex items-center justify-center z-10
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* Event content */}
                      <div className="flex-1 min-w-0 pb-6">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-slate-900 truncate">
                                    {event.title}
                                  </h4>
                                  {event.metadata.badge && (
                                    <Badge variant="secondary" className="shrink-0 text-xs">
                                      {event.metadata.badge}
                                    </Badge>
                                  )}
                                </div>
                                
                                {event.description && (
                                  <p className="text-sm text-slate-600 mb-2">
                                    {event.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {event.date.toLocaleDateString()}
                                  </div>
                                  
                                  {event.metadata.duration && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {event.metadata.duration} min
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {event.metadata.amount && (
                                <div className={`text-right ${
                                  event.type === 'expense' ? 'text-red-700' : 'text-emerald-700'
                                }`}>
                                  <div className="font-semibold tabular-nums">
                                    {event.type === 'expense' ? '-' : '+'}
                                    {formatCurrency(event.metadata.amount)}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Statistics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Timeline Statistics</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Total Events</p>
              <p className="text-2xl font-semibold text-slate-900">
                {timelineEvents.length}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Total Investment</p>
              <p className="text-2xl font-semibold text-red-700">
                {formatCurrency(relationshipHealth.totalInvestment)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-emerald-700">
                {formatCurrency(relationshipHealth.totalRevenue)}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500">Net Value</p>
              <p className={`text-2xl font-semibold ${
                relationshipHealth.totalRevenue - relationshipHealth.totalInvestment > 0
                  ? 'text-emerald-700'
                  : 'text-red-700'
              }`}>
                {formatCurrency(relationshipHealth.totalRevenue - relationshipHealth.totalInvestment)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}