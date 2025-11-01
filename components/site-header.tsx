
"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

const getPageTitle = (pathname: string): string => {
  const pathMap: Record<string, string> = {
    '/admin-management': 'Admin Management',
    '/brand-management': 'Brand Management',
    '/product-management': 'Product Management',
    '/coupon-management': 'Coupon Management',
    '/order-management': 'Order Management',
    '/salesperson-management': 'Salesperson Management',
    '/sub-admin-management': 'Sub Admin Management',
    '/salesperson-comission': 'Salesperson Commission',
    '/sub-admin-comission': 'Sub Admin Commission',
    '/dashboard': 'Dashboard'
  }

  return pathMap[pathname] || 'Dashboard'
}

export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 bg-background border-b border-border px-6 py-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1 px-4">
          <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
