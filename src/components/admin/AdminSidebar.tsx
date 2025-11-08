import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Award, 
  Tag, 
  FlaskConical, 
  Search, 
  Settings, 
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  { 
    title: 'Dashboard', 
    url: '/admin', 
    icon: LayoutDashboard,
    end: true 
  },
  { 
    title: 'ბრონირებები', 
    url: '/admin/bookings', 
    icon: Calendar 
  },
  { 
    title: 'შეტყობინებები', 
    url: '/admin/contacts', 
    icon: MessageSquare 
  },
  { 
    title: 'მომხმარებლები', 
    url: '/admin/users', 
    icon: Users 
  },
  { 
    title: 'ლოიალობა', 
    url: '/admin/loyalty', 
    icon: Award 
  },
  { 
    title: 'პრომო კოდები', 
    url: '/admin/promo-codes', 
    icon: Tag 
  },
  { 
    title: 'A/B Testing', 
    url: '/admin/experiments', 
    icon: FlaskConical 
  },
  { 
    title: 'SEO', 
    url: '/admin/seo', 
    icon: Search 
  },
  { 
    title: 'პარამეტრები', 
    url: '/admin/settings', 
    icon: Settings 
  },
];

export function AdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar 
      className={cn(
        "border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Management</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-4">
              NAVIGATION
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = item.end 
                  ? location.pathname === item.url 
                  : location.pathname.startsWith(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end={item.end}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-primary text-primary-foreground font-medium shadow-sm"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", collapsed && "mx-auto")} />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
