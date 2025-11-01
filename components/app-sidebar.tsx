"use client"

import * as React from "react"
import Image from "next/image"
import {
  IconDashboard,
  IconUserShield,
  IconBuildingStore,
  IconPackage,
  IconUserCheck,
  IconCoins,
  IconTicket,
  IconShoppingCart,
} from "@tabler/icons-react"
import { useUserStore } from "@/store/userStore"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Navigation items for Super Admin
const superAdminNavMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Admin Management",
    url: "/admin-management",
    icon: IconUserShield,
  },
]

// Navigation items for Admin
const adminNavMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Sub Admin Management",
    url: "/sub-admin-management",
    icon: IconUserShield,
  },
  {
    title: "Brand Management",
    url: "/brand-management",
    icon: IconBuildingStore,
  },
  {
    title: "Product Management",
    url: "/product-management",
    icon: IconPackage,
  },
  {
    title: "Salesperson Management",
    url: "/salesperson-management",
    icon: IconUserCheck,
  },
  {
    title: "Order Management",
    url: "/order-management",
    icon: IconShoppingCart,
  },
  {
    title: "Coupon Management",
    url: "/coupon-management",
    icon: IconTicket,
  },
  {
    title: "Sub-Admin Commission",
    url: "/sub-admin-comission",
    icon: IconCoins,
  },
  {
    title: "Salesperson Commission",
    url: "/salesperson-comission",
    icon: IconCoins,
  },
]

// Navigation items for SubAdmin (limited access: Dashboard, Sub Admin Management, Salesperson Management)
const subAdminNavMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Sub Admin Management",
    url: "/sub-admin-management",
    icon: IconUserShield,
  },
  {
    title: "Salesperson Management",
    url: "/salesperson-management",
    icon: IconUserCheck,
  },
  {
    title: "Salesperson Commission",
    url: "/salesperson-comission",
    icon: IconCoins,
  },
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userData, hasHydrated } = useUserStore()

  // Determine which navigation items to show based on user role
  const getNavItems = () => {
    // Don't show any nav items if store hasn't hydrated yet or user data is not loaded
    if (!hasHydrated || !userData) {
      return []
    }

    switch (userData.userType) {
      case "SuperAdmin":
        return superAdminNavMain
      case "Admin":
        return adminNavMain
      case "SubAdmin":
        return subAdminNavMain
      default:
        // Fallback for unknown user types
        console.warn(`Unknown user type: ${userData.userType}`)
        return adminNavMain
    }
  }

  // Show loading state while hydrating
  if (!hasHydrated) {
    return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader className="border-b border-sidebar-border px-4 h-12 flex items-center">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1">
                <Image
                  src="/vritkaLogo.svg"
                  alt="Vritika Logo"
                  width={120}
                  height={28}
                  className="h-7 w-auto"
                />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 text-sm text-muted-foreground">Loading...</div>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar collapsible="offcanvas" className="bg-sidebar border-r border-sidebar-border shadow-sm" {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-4 h-12 flex items-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1 hover:bg-sidebar-accent transition-colors"
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/vritkaLogo.svg"
                  alt="Vritika Logo"
                  width={120}
                  height={28}
                  className="h-7 w-auto"
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <NavMain items={getNavItems()} />
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <NavUser user={{
          name: userData?.name || "User",
          email: userData?.email || "",
          avatar: userData?.image || "/avatars/default.jpg",
          role: userData?.userType
        }} />
      </SidebarFooter>
    </Sidebar>
  )
}
