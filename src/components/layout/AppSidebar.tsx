import { LayoutDashboard, Users, Home, FileText, Activity, Settings, User as UserIcon } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Properties", url: "/properties", icon: Home },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "System Health", url: "/system-health", icon: Activity },
  { title: "Settings", url: "/settings", icon: Settings },
];

function UserProfile({ open }: { open: boolean }) {
  const { user, loading } = useCurrentUser();
  
  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        {open && (
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src="" alt={user.full_name} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {open && (
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium text-sidebar-foreground">
            {user.full_name}
          </span>
          <span className="truncate text-xs text-sidebar-foreground/60">
            {user.email}
          </span>
        </div>
      )}
    </div>
  );
}

export function AppSidebar() {
  const { open, isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="font-heading text-sm font-bold text-sidebar-foreground">
                Admin Portal
              </span>
              <span className="text-xs text-sidebar-foreground/60">Property Management</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <div className="border-b border-sidebar-border p-2">
        <UserProfile open={open} />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Handle the root path specifically to avoid matching all routes
                const isRoot = item.url === '/';
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={isRoot}
                        className={({ isActive }) =>
                          `flex items-center gap-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-sidebar-foreground/80 hover:text-sidebar-foreground'}`
                        }
                        onClick={() => isMobile && setOpenMobile(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
