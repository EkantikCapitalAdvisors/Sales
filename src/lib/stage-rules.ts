import type { AllStageId, StageId } from "./constants";

export interface StageTransitionCheck {
  allowed: boolean;
  warnings: string[];
  errors: string[];
}

export interface ProspectStageContext {
  currentStage: AllStageId;
  discoveryCallScheduled: boolean;
  discoveryCallCompleted: boolean;
  dashboardLinkSent: boolean;
  freedomLinkSent: boolean;
  dashboardViewed: boolean;
  strategyPresentationCompleted: boolean;
  customPlanDelivered: boolean;
  lostReason?: string;
}

export function checkStageTransition(
  context: ProspectStageContext,
  targetStage: AllStageId
): StageTransitionCheck {
  const result: StageTransitionCheck = {
    allowed: true,
    warnings: [],
    errors: [],
  };

  // Moving to lost/paused always requires a reason
  if (targetStage === "lost" || targetStage === "paused") {
    if (!context.lostReason) {
      result.errors.push(
        `A reason is required when moving to ${targetStage}.`
      );
      result.allowed = false;
    }
    return result;
  }

  // Can't move from lost/paused without explicit reactivation
  if (
    context.currentStage === "lost" ||
    context.currentStage === "paused"
  ) {
    result.warnings.push(
      "Reactivating a prospect from " + context.currentStage + " status."
    );
  }

  switch (targetStage) {
    case "discovery":
      if (!context.discoveryCallScheduled) {
        result.errors.push("Discovery call must be scheduled before advancing.");
        result.allowed = false;
      }
      break;

    case "leavebehind":
      if (!context.discoveryCallCompleted) {
        result.errors.push("Discovery call must be completed before advancing.");
        result.allowed = false;
      }
      if (!context.dashboardLinkSent) {
        result.errors.push("Dashboard link must be sent before advancing.");
        result.allowed = false;
      }
      break;

    case "diligence":
      if (!context.dashboardLinkSent) {
        result.errors.push("Dashboard link must be sent before advancing.");
        result.allowed = false;
      }
      if (!context.freedomLinkSent) {
        result.errors.push("Freedom link must be sent before advancing.");
        result.allowed = false;
      }
      break;

    case "strategy":
      if (!context.dashboardViewed) {
        result.warnings.push(
          "Prospect has not confirmed viewing the dashboard. Consider verifying before advancing."
        );
      }
      break;

    case "close":
      if (!context.strategyPresentationCompleted) {
        result.errors.push(
          "Strategy presentation must be completed before closing."
        );
        result.allowed = false;
      }
      if (!context.customPlanDelivered) {
        result.errors.push(
          "Custom plan must be delivered before closing."
        );
        result.allowed = false;
      }
      break;
  }

  return result;
}

export function getStageIndex(stage: StageId): number {
  const stages: StageId[] = [
    "outreach",
    "discovery",
    "leavebehind",
    "diligence",
    "strategy",
    "close",
  ];
  return stages.indexOf(stage);
}

export function isBackwardMove(from: StageId, to: StageId): boolean {
  return getStageIndex(to) < getStageIndex(from);
}
