"use client";

import { useParams, useRouter } from "next/navigation";
import { useProspect, useDeleteProspect } from "@/hooks/use-prospects";
import { ActivityTimeline } from "@/components/activities/activity-timeline";
import { ProspectForm } from "@/components/prospects/prospect-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, daysSince } from "@/lib/utils";
import { PIPELINE_STAGES } from "@/lib/constants";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ProspectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: prospect, isLoading } = useProspect(id);
  const deleteProspect = useDeleteProspect();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A4A]" />
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Prospect not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/prospects")}>
          Back to Prospects
        </Button>
      </div>
    );
  }

  const stageLabel =
    PIPELINE_STAGES.find((s) => s.id === prospect.stage)?.label || prospect.stage;

  if (isEditing) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsEditing(false)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </button>
        <h1 className="text-2xl font-bold text-[#1B2A4A]">
          Edit {prospect.firstName} {prospect.lastName}
        </h1>
        <ProspectForm prospect={prospect} mode="edit" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push("/prospects")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            All Prospects
          </button>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">
            {prospect.firstName} {prospect.lastName}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={prospect.temperature as "hot" | "warm" | "cold"}>
              {prospect.temperature}
            </Badge>
            <Badge variant="outline">{stageLabel}</Badge>
            <Badge variant="gold" className="capitalize">
              {prospect.foundingVsStandard}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-1">
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  await deleteProspect.mutateAsync(prospect.id);
                  router.push("/prospects");
                }}
              >
                Confirm Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>{" "}
              <a href={`mailto:${prospect.email}`} className="text-[#1B2A4A] hover:underline">
                {prospect.email}
              </a>
            </div>
            {prospect.phone && (
              <div>
                <span className="text-gray-500">Phone:</span> {prospect.phone}
              </div>
            )}
            {prospect.whatsappNumber && (
              <div>
                <span className="text-gray-500">WhatsApp:</span>{" "}
                {prospect.whatsappNumber}
              </div>
            )}
            {prospect.telegramUsername && (
              <div>
                <span className="text-gray-500">Telegram:</span>{" "}
                {prospect.telegramUsername}
              </div>
            )}
            {prospect.spouseName && (
              <div>
                <span className="text-gray-500">Spouse:</span>{" "}
                {prospect.spouseName}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Investable Capital:</span>{" "}
              <span className="font-semibold">
                {formatCurrency(Number(prospect.investableCapital))}
              </span>
            </div>
            {prospect.estimatedAum && (
              <div>
                <span className="text-gray-500">Est. AUM:</span>{" "}
                {formatCurrency(Number(prospect.estimatedAum))}
              </div>
            )}
            {prospect.annualIncome && (
              <div>
                <span className="text-gray-500">Annual Income:</span>{" "}
                {formatCurrency(Number(prospect.annualIncome))}
              </div>
            )}
            {prospect.currentAdvisor && (
              <div>
                <span className="text-gray-500">Current Advisor:</span>{" "}
                {prospect.currentAdvisor}
              </div>
            )}
            {prospect.investmentExperience && (
              <div className="capitalize">
                <span className="text-gray-500">Experience:</span>{" "}
                {prospect.investmentExperience}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Intelligence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="capitalize">
              <span className="text-gray-500">Source:</span> {prospect.source}
              {prospect.sourceDetail && ` — ${prospect.sourceDetail}`}
            </div>
            <div>
              <span className="text-gray-500">Days in Stage:</span>{" "}
              {daysSince(prospect.stageEnteredAt)}
            </div>
            {prospect.nextFollowUp && (
              <div>
                <span className="text-gray-500">Next Follow-Up:</span>{" "}
                {new Date(prospect.nextFollowUp).toLocaleDateString()}
              </div>
            )}
            {prospect.estimatedCloseDate && (
              <div>
                <span className="text-gray-500">Est. Close:</span>{" "}
                {new Date(prospect.estimatedCloseDate).toLocaleDateString()}
              </div>
            )}
            {prospect.notes && (
              <div>
                <span className="text-gray-500">Notes:</span>{" "}
                <p className="text-gray-700 mt-1">{prospect.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <div>
        <h2 className="text-xl font-bold text-[#1B2A4A] mb-4">
          Activity Timeline
        </h2>
        <ActivityTimeline prospectId={prospect.id} />
      </div>
    </div>
  );
}
