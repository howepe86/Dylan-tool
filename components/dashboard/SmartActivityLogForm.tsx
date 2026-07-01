"use client";

import { FormEvent, useEffect, useState } from "react";
import { Sparkles, Clock, DollarSign, MapPin, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ACTIVITY_TYPES, EXPENSE_CATEGORIES } from "@/lib/reports";
import { analyzeActivityText, recordUserCorrection, type SmartSuggestions } from "@/lib/smart-categorization";
import type { Client, ActivityType } from "@/types/database";

interface SmartActivityLogFormProps {
  clients: Client[];
  existingActivities?: Array<{
    title: string;
    activity_type: ActivityType;
    duration_minutes: number;
  }>;
}

export function SmartActivityLogForm({ clients, existingActivities = [] }: SmartActivityLogFormProps) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [activityType, setActivityType] = useState("meeting");
  const [occurredAt, setOccurredAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("meals");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [dealAmount, setDealAmount] = useState("");
  const [dealTitle, setDealTitle] = useState("");
  const [dealStatus, setDealStatus] = useState("pipeline");
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Smart suggestions state
  const [suggestions, setSuggestions] = useState<SmartSuggestions>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState({
    activityType: false,
    duration: false,
    expenseCategory: false,
    expenseAmount: false,
  });

  // Analyze text and generate suggestions when title or notes change
  useEffect(() => {
    if (title.trim().length < 3) {
      setSuggestions({});
      setShowSuggestions(false);
      return;
    }

    const newSuggestions = analyzeActivityText(title, notes, existingActivities);
    setSuggestions(newSuggestions);
    setShowSuggestions(Object.keys(newSuggestions).length > 0);

    // Auto-apply high-confidence suggestions
    if (newSuggestions.activityType?.confidence && newSuggestions.activityType.confidence > 80 && !appliedSuggestions.activityType) {
      setActivityType(newSuggestions.activityType.activityType);
      setAppliedSuggestions(prev => ({ ...prev, activityType: true }));
    }

    if (newSuggestions.estimatedDuration && !appliedSuggestions.duration) {
      setDurationMinutes(newSuggestions.estimatedDuration.toString());
      setAppliedSuggestions(prev => ({ ...prev, duration: true }));
    }

    if (newSuggestions.expenseCategory?.confidence && newSuggestions.expenseCategory.confidence > 70 && !appliedSuggestions.expenseCategory) {
      setExpenseCategory(newSuggestions.expenseCategory.category);
      setAppliedSuggestions(prev => ({ ...prev, expenseCategory: true }));
    }

    if (newSuggestions.estimatedExpense?.confidence && newSuggestions.estimatedExpense.confidence > 70 && !appliedSuggestions.expenseAmount) {
      setExpenseAmount(newSuggestions.estimatedExpense.amount.toString());
      setAppliedSuggestions(prev => ({ ...prev, expenseAmount: true }));
    }
  }, [title, notes, existingActivities, appliedSuggestions]);

  // Reset applied suggestions when user manually changes values
  useEffect(() => {
    setAppliedSuggestions(prev => ({ ...prev, activityType: false }));
  }, [activityType]);

  useEffect(() => {
    setAppliedSuggestions(prev => ({ ...prev, duration: false }));
  }, [durationMinutes]);

  useEffect(() => {
    setAppliedSuggestions(prev => ({ ...prev, expenseCategory: false }));
  }, [expenseCategory]);

  useEffect(() => {
    setAppliedSuggestions(prev => ({ ...prev, expenseAmount: false }));
  }, [expenseAmount]);

  if (clients.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Add a client first before logging activities.
      </p>
    );
  }

  function applySuggestion(type: 'activityType' | 'duration' | 'expenseCategory' | 'expenseAmount') {
    switch (type) {
      case 'activityType':
        if (suggestions.activityType) {
          setActivityType(suggestions.activityType.activityType);
        }
        break;
      case 'duration':
        if (suggestions.estimatedDuration) {
          setDurationMinutes(suggestions.estimatedDuration.toString());
        }
        break;
      case 'expenseCategory':
        if (suggestions.expenseCategory) {
          setExpenseCategory(suggestions.expenseCategory.category);
        }
        break;
      case 'expenseAmount':
        if (suggestions.estimatedExpense) {
          setExpenseAmount(suggestions.estimatedExpense.amount.toString());
        }
        break;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Record user corrections for learning
    if (suggestions.activityType && suggestions.activityType.activityType !== activityType) {
      recordUserCorrection(
        `${title} ${notes}`,
        suggestions.activityType.activityType,
        activityType as ActivityType,
        suggestions.expenseCategory?.category,
        expenseCategory
      );
    }

    try {
      let voiceMemoUrl: string | undefined;

      if (voiceFile) {
        const formData = new FormData();
        formData.append("file", voiceFile);
        const uploadRes = await fetch("/api/voice/upload", {
          method: "POST",
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error ?? "Voice upload failed");
        voiceMemoUrl = uploadJson.url;
      }

      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          title,
          notes: notes || undefined,
          activityType,
          occurredAt: new Date(occurredAt).toISOString(),
          durationMinutes: Number(durationMinutes),
          inputSource: voiceFile ? "voice" : "manual",
          voiceMemoUrl,
          expense:
            expenseAmount.trim() !== ""
              ? {
                  amountCents: Math.round(Number(expenseAmount) * 100),
                  category: expenseCategory,
                  description: expenseDescription || undefined,
                }
              : undefined,
          deal:
            dealAmount.trim() !== ""
              ? {
                  title: dealTitle || title,
                  amountCents: Math.round(Number(dealAmount) * 100),
                  status: dealStatus,
                }
              : undefined,
        }),
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Failed to save activity");

      setMessage("Activity saved successfully!");
      setTitle("");
      setNotes("");
      setExpenseAmount("");
      setExpenseDescription("");
      setDealAmount("");
      setDealTitle("");
      setVoiceFile(null);
      setSuggestions({});
      setShowSuggestions(false);
      setAppliedSuggestions({
        activityType: false,
        duration: false,
        expenseCategory: false,
        expenseAmount: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Smart Suggestions Panel */}
      {showSuggestions && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.activityType && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      Activity Type
                    </Badge>
                    <Badge className="text-xs bg-blue-100 text-blue-700">
                      {Math.round(suggestions.activityType.confidence)}% confident
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">
                    Suggested: <span className="text-indigo-600">{suggestions.activityType.activityType}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {suggestions.activityType.reasons[0]}
                  </p>
                </div>
                {activityType !== suggestions.activityType.activityType && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestion('activityType')}
                  >
                    Apply
                  </Button>
                )}
              </div>
            )}

            {suggestions.estimatedDuration && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <Badge variant="secondary" className="text-xs">Duration</Badge>
                  </div>
                  <p className="text-sm">
                    Suggested: <span className="font-medium">{suggestions.estimatedDuration} minutes</span>
                  </p>
                </div>
                {Number(durationMinutes) !== suggestions.estimatedDuration && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestion('duration')}
                  >
                    Apply
                  </Button>
                )}
              </div>
            )}

            {suggestions.expenseCategory && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-3 w-3 text-slate-500" />
                    <Badge variant="secondary" className="text-xs">Expense Category</Badge>
                    <Badge className="text-xs bg-green-100 text-green-700">
                      {Math.round(suggestions.expenseCategory.confidence)}% confident
                    </Badge>
                  </div>
                  <p className="text-sm">
                    Suggested: <span className="font-medium capitalize">{suggestions.expenseCategory.category}</span>
                  </p>
                </div>
                {expenseCategory !== suggestions.expenseCategory.category && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestion('expenseCategory')}
                  >
                    Apply
                  </Button>
                )}
              </div>
            )}

            {suggestions.estimatedExpense && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-3 w-3 text-slate-500" />
                    <Badge variant="secondary" className="text-xs">Expense Amount</Badge>
                  </div>
                  <p className="text-sm">
                    Suggested: <span className="font-medium">${suggestions.estimatedExpense.amount}</span>
                  </p>
                </div>
                {Number(expenseAmount) !== suggestions.estimatedExpense.amount && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => applySuggestion('expenseAmount')}
                  >
                    Apply
                  </Button>
                )}
              </div>
            )}

            {suggestions.venues && suggestions.venues.length > 0 && (
              <div className="p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  <Badge variant="secondary" className="text-xs">Popular Venues</Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {suggestions.venues.slice(0, 3).map((venue, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {venue}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger id="client">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.company
                    ? `${client.name} (${client.company})`
                    : client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Activity title</Label>
          <Input
            id="title"
            placeholder="Client lunch at Nobu"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          {suggestions.activityType && (
            <p className="text-xs text-slate-500">
              💡 This looks like a <strong>{suggestions.activityType.activityType}</strong>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="activityType">Activity type</Label>
          <Select value={activityType} onValueChange={setActivityType}>
            <SelectTrigger id="activityType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.label}
                  {suggestions.activityType?.activityType === item.id && (
                    <Badge className="ml-2 text-xs bg-indigo-100 text-indigo-700">
                      Suggested
                    </Badge>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="occurredAt">When</Label>
            <Input
              id="occurredAt"
              type="datetime-local"
              required
              value={occurredAt}
              onChange={(event) => setOccurredAt(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={0}
              required
              value={durationMinutes}
              onChange={(event) => setDurationMinutes(event.target.value)}
            />
            {suggestions.estimatedDuration && Number(durationMinutes) === suggestions.estimatedDuration && (
              <p className="text-xs text-green-600">
                ✓ Smart suggestion applied
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Discussed Q3 expansion, follow up with proposal..."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Expense (optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expenseAmount">Amount (USD)</Label>
                <Input
                  id="expenseAmount"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="125.00"
                  value={expenseAmount}
                  onChange={(event) => setExpenseAmount(event.target.value)}
                />
                {suggestions.estimatedExpense && Number(expenseAmount) === suggestions.estimatedExpense.amount && (
                  <p className="text-xs text-green-600">
                    ✓ Smart estimate applied
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expenseCategory">Category</Label>
                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                  <SelectTrigger id="expenseCategory">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                        {suggestions.expenseCategory?.category === item && (
                          <Badge className="ml-2 text-xs bg-green-100 text-green-700">
                            Suggested
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseDescription">Description</Label>
              <Input
                id="expenseDescription"
                placeholder="Lunch for two"
                value={expenseDescription}
                onChange={(event) => setExpenseDescription(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Deal / revenue (optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dealTitle">Deal title</Label>
              <Input
                id="dealTitle"
                placeholder="Annual services contract"
                value={dealTitle}
                onChange={(event) => setDealTitle(event.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dealAmount">Amount (USD)</Label>
                <Input
                  id="dealAmount"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="50000"
                  value={dealAmount}
                  onChange={(event) => setDealAmount(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealStatus">Status</Label>
                <Select value={dealStatus} onValueChange={setDealStatus}>
                  <SelectTrigger id="dealStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="pipeline">Pipeline</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Voice memo (optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-slate-500">
              Upload an audio recap from your phone. Transcription comes in phase 2.
            </p>
            <Input
              type="file"
              accept="audio/*"
              onChange={(event) => setVoiceFile(event.target.files?.[0] ?? null)}
            />
          </CardContent>
        </Card>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save activity"}
        </Button>
      </form>
    </div>
  );
}