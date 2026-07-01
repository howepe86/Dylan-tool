"use client";

import { useState } from "react";
import { ScanLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { parseReceiptAmount, parseReceiptMerchant } from "@/lib/receipt-parse";
import { suggestExpenseCategory } from "@/lib/categorize";

export function ReceiptScanner({
  onParsed,
}: {
  onParsed: (data: { amount: number; description?: string; category?: string }) => void;
}) {
  const [text, setText] = useState("");
  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function scanImage(file: File) {
    setScanning(true);
    setPreview(URL.createObjectURL(file));
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(file);
      await worker.terminate();
      setText(data.text);
      applyParsed(data.text);
    } catch {
      setText("");
    } finally {
      setScanning(false);
    }
  }

  function applyParsed(raw: string) {
    const amount = parseReceiptAmount(raw);
    if (!amount) return;
    const merchant = parseReceiptMerchant(raw);
    const category = suggestExpenseCategory(merchant ?? "", raw)?.category;
    onParsed({
      amount,
      description: merchant ?? undefined,
      category,
    });
  }

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
        <ScanLine className="h-4 w-4 text-indigo-600" aria-hidden />
        Receipt scan
      </div>
      <p className="text-xs text-slate-500">
        Upload a receipt photo or paste text — we&apos;ll extract the amount and category.
      </p>
      <input
        type="file"
        accept="image/*"
        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500"
        disabled={scanning}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) scanImage(file);
        }}
      />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Receipt preview" className="max-h-32 rounded-lg border border-slate-200" />
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="receiptText">Or paste receipt text</Label>
        <Textarea
          id="receiptText"
          rows={3}
          placeholder="TOTAL  $142.50"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!text.trim() || scanning}
        onClick={() => applyParsed(text)}
      >
        {scanning ? <LoadingSpinner label="Scanning…" /> : "Extract amount"}
      </Button>
    </div>
  );
}
