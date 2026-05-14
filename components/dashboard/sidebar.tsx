'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Gift, 
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface DashboardSidebarProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
}

const navItems = [
  //{ href: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { href: '/dashboard/eventos', icon: Calendar, label: 'Mis Eventos' },
  //{ href: '/dashboard/invitados', icon: Users, label: 'Invitados' },
  //{ href: '/dashboard/regalos', icon: Gift, label: 'Regalos' },
  //{ href: '/dashboard/configuracion', icon: Settings, label: 'Configuracion' },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={cn(
      "hidden border-r border-border bg-card transition-all duration-300 lg:flex lg:flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Create Button */}
        <div className="p-4">
          <Button asChild className={cn("w-full rounded-xl", collapsed && "px-2")}>
            <Link href="/crear-evento">
              <Plus className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Crear Invitacion</span>}
            </Link>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Colapsar</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  )
}
