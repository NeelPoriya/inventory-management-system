"use client";
import { Button } from "@/components/ui/button";

export default function ReportPage() {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="w-full p-2 flex justify-between">
        <div className="flex gap-4 justify-between w-full">
          <h1 className="text-2xl font-bold">Report</h1>
          <Button
            onClick={() => {
              // go to /api/pdf on new tab
              window.open("/api/pdf", "_blank");
            }}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
