"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProspect, useUpdateProspect } from "@/hooks/use-prospects";
import type { Prospect } from "@/lib/db/schema";

interface ProspectFormProps {
  prospect?: Prospect;
  mode: "create" | "edit";
}

export function ProspectForm({ prospect, mode }: ProspectFormProps) {
  const router = useRouter();
  const createProspect = useCreateProspect();
  const updateProspect = useUpdateProspect();

  const [form, setForm] = useState({
    firstName: prospect?.firstName || "",
    lastName: prospect?.lastName || "",
    email: prospect?.email || "",
    phone: prospect?.phone || "",
    whatsappNumber: prospect?.whatsappNumber || "",
    telegramUsername: prospect?.telegramUsername || "",
    mailingAddress: prospect?.mailingAddress || "",
    dateOfBirth: prospect?.dateOfBirth || "",
    spouseName: prospect?.spouseName || "",
    spouseEmail: prospect?.spouseEmail || "",
    investableCapital: prospect?.investableCapital?.toString() || "",
    annualIncome: prospect?.annualIncome?.toString() || "",
    currentAdvisor: prospect?.currentAdvisor || "",
    currentFeePct: prospect?.currentFeePct?.toString() || "",
    investmentExperience: prospect?.investmentExperience || "",
    riskTolerance: prospect?.riskTolerance || "",
    tenYearGoal: prospect?.tenYearGoal || "",
    targetMonthlyIncome: prospect?.targetMonthlyIncome?.toString() || "",
    source: prospect?.source || "referral",
    sourceDetail: prospect?.sourceDetail || "",
    temperature: prospect?.temperature || "warm",
    foundingVsStandard: prospect?.foundingVsStandard || "undecided",
    estimatedAum: prospect?.estimatedAum?.toString() || "",
    estimatedCloseDate: prospect?.estimatedCloseDate || "",
    nextFollowUp: prospect?.nextFollowUp || "",
    notes: prospect?.notes || "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.lastName || !form.email || !form.investableCapital) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      if (mode === "create") {
        await createProspect.mutateAsync(form);
      } else if (prospect) {
        await updateProspect.mutateAsync({ id: prospect.id, ...form });
      }
      router.push("/prospects");
    } catch {
      setError("Failed to save prospect. Please try again.");
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {/* Contact Information */}
      <section>
        <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <Input
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <Input
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number
            </label>
            <Input
              value={form.whatsappNumber}
              onChange={(e) => update("whatsappNumber", e.target.value)}
              placeholder="+1..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telegram Username
            </label>
            <Input
              value={form.telegramUsername}
              onChange={(e) => update("telegramUsername", e.target.value)}
              placeholder="@username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spouse/Partner Name
            </label>
            <Input
              value={form.spouseName}
              onChange={(e) => update("spouseName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spouse/Partner Email
            </label>
            <Input
              type="email"
              value={form.spouseEmail}
              onChange={(e) => update("spouseEmail", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Financial Profile */}
      <section>
        <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4">
          Financial Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investable Capital ($) *
            </label>
            <Input
              type="number"
              value={form.investableCapital}
              onChange={(e) => update("investableCapital", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Annual Income ($)
            </label>
            <Input
              type="number"
              value={form.annualIncome}
              onChange={(e) => update("annualIncome", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Advisor
            </label>
            <Input
              value={form.currentAdvisor}
              onChange={(e) => update("currentAdvisor", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current AUM Fee %
            </label>
            <Input
              type="number"
              step="0.01"
              value={form.currentFeePct}
              onChange={(e) => update("currentFeePct", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Experience
            </label>
            <Select
              value={form.investmentExperience}
              onChange={(e) => update("investmentExperience", e.target.value)}
            >
              <option value="">Select...</option>
              <option value="novice">Novice</option>
              <option value="intermediate">Intermediate</option>
              <option value="sophisticated">Sophisticated</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk Tolerance
            </label>
            <Select
              value={form.riskTolerance}
              onChange={(e) => update("riskTolerance", e.target.value)}
            >
              <option value="">Select...</option>
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              10-Year Goal
            </label>
            <Textarea
              value={form.tenYearGoal}
              onChange={(e) => update("tenYearGoal", e.target.value)}
              placeholder="What does financial freedom mean to them?"
            />
          </div>
        </div>
      </section>

      {/* Sales Intelligence */}
      <section>
        <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4">
          Sales Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source *
            </label>
            <Select
              value={form.source}
              onChange={(e) => update("source", e.target.value)}
            >
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source Detail
            </label>
            <Input
              value={form.sourceDetail}
              onChange={(e) => update("sourceDetail", e.target.value)}
              placeholder="Referrer name or source specifics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature
            </label>
            <Select
              value={form.temperature}
              onChange={(e) => update("temperature", e.target.value)}
            >
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Founding vs Standard
            </label>
            <Select
              value={form.foundingVsStandard}
              onChange={(e) => update("foundingVsStandard", e.target.value)}
            >
              <option value="undecided">Undecided</option>
              <option value="founding">Founding Member</option>
              <option value="standard">Standard</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated AUM ($)
            </label>
            <Input
              type="number"
              value={form.estimatedAum}
              onChange={(e) => update("estimatedAum", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Close Date
            </label>
            <Input
              type="date"
              value={form.estimatedCloseDate}
              onChange={(e) => update("estimatedCloseDate", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Follow-Up
            </label>
            <Input
              type="date"
              value={form.nextFollowUp}
              onChange={(e) => update("nextFollowUp", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Notes */}
      <section>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <Textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={4}
        />
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={createProspect.isPending || updateProspect.isPending}>
          {mode === "create" ? "Create Prospect" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
