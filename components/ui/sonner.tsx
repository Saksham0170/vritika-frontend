"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(16px)",
          fontSize: "14px",
          fontWeight: "500",
        },
        classNames: {
          success: "border-green-200 bg-green-50/90 text-green-900 dark:border-green-800 dark:bg-green-950/90 dark:text-green-100",
          error: "border-red-200 bg-red-50/90 text-red-900 dark:border-red-800 dark:bg-red-950/90 dark:text-red-100",
          info: "border-blue-200 bg-blue-50/90 text-blue-900 dark:border-blue-800 dark:bg-blue-950/90 dark:text-blue-100",
          warning: "border-amber-200 bg-amber-50/90 text-amber-900 dark:border-amber-800 dark:bg-amber-950/90 dark:text-amber-100",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
