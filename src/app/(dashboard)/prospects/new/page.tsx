import { ProspectForm } from "@/components/prospects/prospect-form";

export default function NewProspectPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[#1B2A4A]">Add New Prospect</h1>
      <ProspectForm mode="create" />
    </div>
  );
}
