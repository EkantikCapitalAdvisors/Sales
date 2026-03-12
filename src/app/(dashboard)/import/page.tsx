"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, FileJson, Check, AlertTriangle } from "lucide-react";

interface ImportPreview {
  valid: number;
  invalid: number;
  prospects: Array<{
    firstName: string;
    lastName: string;
    email: string;
    investableCapital: string;
    source: string;
  }>;
  errors: string[];
}

export default function ImportPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    count: number;
  } | null>(null);
  const [fileError, setFileError] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError("");
    setResult(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const prospects = Array.isArray(data) ? data : data.prospects || [];

      const valid: ImportPreview["prospects"] = [];
      const errors: string[] = [];

      prospects.forEach((p: Record<string, unknown>, i: number) => {
        const firstName = (p.firstName || p.first_name || p.name?.toString().split(" ")[0] || "") as string;
        const lastName = (p.lastName || p.last_name || p.name?.toString().split(" ").slice(1).join(" ") || "") as string;
        const email = (p.email || "") as string;
        const capital = (p.investableCapital || p.investable_capital || p.capital || "0") as string;
        const source = (p.source || "other") as string;

        if (!firstName || !email) {
          errors.push(`Row ${i + 1}: Missing required fields (name or email)`);
        } else {
          valid.push({
            firstName,
            lastName,
            email,
            investableCapital: capital.toString(),
            source,
          });
        }
      });

      setPreview({
        valid: valid.length,
        invalid: errors.length,
        prospects: valid,
        errors,
      });
    } catch {
      setFileError("Invalid JSON file. Please check the format.");
    }
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    try {
      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch: preview.prospects }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult({ success: true, count: data.count || preview.valid });
        setPreview(null);
      } else {
        setResult({ success: false, count: 0 });
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1B2A4A]">Import Data</h1>

      <Card>
        <CardHeader>
          <CardTitle>Import from JSON</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload a JSON file containing prospect data from the Sales Command
            Center or any other source. The file should contain an array of
            prospect objects.
          </p>

          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#C8A951] transition-colors"
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-gray-400 mt-1">JSON files only</p>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {fileError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {fileError}
            </div>
          )}

          {result && (
            <div
              className={`p-3 border text-sm rounded-md flex items-center gap-2 ${
                result.success
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {result.success ? (
                <>
                  <Check className="h-4 w-4" />
                  Successfully imported {result.count} prospects.
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Import failed. Please try again.
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {preview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Preview ({preview.valid} valid, {preview.invalid} invalid)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {preview.errors.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm font-medium text-amber-700 mb-1">
                  Warnings:
                </p>
                {preview.errors.slice(0, 5).map((err, i) => (
                  <p key={i} className="text-xs text-amber-600">
                    {err}
                  </p>
                ))}
                {preview.errors.length > 5 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ...and {preview.errors.length - 5} more
                  </p>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 text-gray-600">Name</th>
                    <th className="text-left px-3 py-2 text-gray-600">Email</th>
                    <th className="text-left px-3 py-2 text-gray-600">
                      Capital
                    </th>
                    <th className="text-left px-3 py-2 text-gray-600">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.prospects.slice(0, 10).map((p, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">
                        {p.firstName} {p.lastName}
                      </td>
                      <td className="px-3 py-2 text-gray-500">{p.email}</td>
                      <td className="px-3 py-2">
                        ${Number(p.investableCapital).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 capitalize">{p.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.prospects.length > 10 && (
                <p className="text-xs text-gray-400 p-3">
                  Showing 10 of {preview.prospects.length} prospects
                </p>
              )}
            </div>

            <Button
              onClick={handleImport}
              disabled={importing || preview.valid === 0}
            >
              {importing
                ? "Importing..."
                : `Import ${preview.valid} Prospects`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Expected format */}
      <Card>
        <CardHeader>
          <CardTitle>Expected JSON Format</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
            {JSON.stringify(
              [
                {
                  firstName: "John",
                  lastName: "Doe",
                  email: "john@example.com",
                  investableCapital: 500000,
                  source: "referral",
                  phone: "+1234567890",
                  temperature: "warm",
                },
              ],
              null,
              2
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
