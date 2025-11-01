import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"

export default function Dashboard() {
  return (
    <div className="max-w-screen-xl mx-auto p-6 space-y-8">
      <div className="pb-4 border-b border-border/40">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your business metrics and performance at a glance
        </p>
      </div>

      <SectionCards />

      <div className="space-y-6">
        <ChartAreaInteractive />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <DataTable
            data={data}
            searchKey="header"
            searchPlaceholder="Search activities..."
            columns={[
              { accessorKey: "id", header: "ID" },
              { accessorKey: "header", header: "Header" },
              { accessorKey: "type", header: "Type" },
              { accessorKey: "status", header: "Status" },
              { accessorKey: "target", header: "Target" },
              { accessorKey: "limit", header: "Limit" },
              { accessorKey: "reviewer", header: "Reviewer" },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
