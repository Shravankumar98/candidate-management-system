import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Columns,
  Activity,
  Plus,
  Sun,
  Moon,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { clearStoredAuth, getStoredAuthUser } from "@/lib/auth-storage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    role?: string;
  } | null>(null);

  useEffect(() => {
    const storedUser = getStoredAuthUser<{
      name?: string;
      email?: string;
      role?: string;
    }>();
    setUser(storedUser);
  }, []);

  const role = user?.role ?? "recruiter";
  const isAdmin = role === "admin";

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/candidates", label: "Candidates", icon: Users },
    { href: "/kanban", label: "Pipeline", icon: Columns },
    { href: "/activity", label: "Activity Log", icon: Activity },
  ];

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  const initials = useMemo(() => {
    const name = user?.name || user?.email || "User";
    return name
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  return (
    <div className="w-64 border-r border-border bg-sidebar flex flex-col h-full text-sidebar-foreground">
      <div className="h-14 flex items-center px-4 border-b border-border">
        <div className="w-6 h-6 rounded bg-primary mr-2 flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary-foreground">
            A
          </span>
        </div>
        <span className="font-semibold tracking-tight text-sm">
          ATS Command
        </span>
      </div>

      <div className="p-4">
        <Button
          asChild
          className="w-full justify-start h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/candidates/new">
            <Plus className="w-4 h-4 mr-2" />
            New Candidate
          </Link>
        </Button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {links.map((link) => {
          const isActive =
            location === link.href ||
            (link.href !== "/dashboard" && location.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-3 h-9 text-sm rounded-md transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {isAdmin && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
            <Shield className="w-3 h-3" />
            Admin
          </div>
        </div>
      )}

      <div className="p-3 border-t border-border flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-1 flex items-center gap-2 text-sm font-medium hover:bg-sidebar-accent/50 rounded-md px-2 py-1.5 transition-colors text-left min-w-0">
              <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium text-foreground">
                  {displayName}
                </div>
                <div className="text-[10px] text-muted-foreground capitalize">
                  {role}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm gap-2 cursor-pointer">
              <User className="w-3.5 h-3.5" />
              {isAdmin ? "Admin" : "Recruiter"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-sm gap-2 text-destructive focus:text-destructive cursor-pointer"
              onClick={() => {
                clearStoredAuth();
                window.location.href = `${basePath}/`;
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-md flex-shrink-0"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
}
