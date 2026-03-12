import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PipelinePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Pipeline</h1>
        <Link href="/prospects/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Prospect
          </Button>
        </Link>
      </div>
      <PipelineBoard />
    </div>
  );
}
