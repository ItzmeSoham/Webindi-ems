import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CalendarDays,
  FileBarChart,
  Settings,
  UserCog,
  ScrollText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const getNavItems = (role: string): NavItem[] => {
  switch (role) {
    case 'HR':
      return [
        { label: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
        { label: 'Employees', path: '/hr/employees', icon: Users },
        { label: 'Attendance', path: '/hr/attendance', icon: ClipboardCheck },
        { label: 'Leaves', path: '/hr/leaves', icon: CalendarDays },
        { label: 'Reports', path: '/hr/reports', icon: FileBarChart },
        { label: 'Settings', path: '/settings', icon: Settings },
      ];
    case 'DIRECTOR':
      return [
        { label: 'Dashboard', path: '/director/dashboard', icon: LayoutDashboard },
        { label: 'Employees', path: '/hr/employees', icon: Users },
        { label: 'Attendance', path: '/hr/attendance', icon: ClipboardCheck },
        { label: 'Leaves', path: '/hr/leaves', icon: CalendarDays },
        { label: 'Settings', path: '/settings', icon: Settings },
      ];
    case 'SUPERADMIN':
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Users', path: '/admin/users', icon: UserCog },
        { label: 'Employees', path: '/hr/employees', icon: Users },
        { label: 'Attendance', path: '/hr/attendance', icon: ClipboardCheck },
        { label: 'Leaves', path: '/hr/leaves', icon: CalendarDays },
        { label: 'Reports', path: '/hr/reports', icon: FileBarChart },
        { label: 'Activity Logs', path: '/admin/logs', icon: ScrollText },
        { label: 'Settings', path: '/settings', icon: Settings },
      ];
    default:
      return [];
  }
};

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = getNavItems(user.role);
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sidebarContent = (
    <div
      className={`
        h-screen flex flex-col bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50
        transition-all duration-300 relative
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-slate-700/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          {!isCollapsed && (
            <div className="animate-fadeIn">
              <h1 className="text-lg font-bold gradient-text leading-none">EMS</h1>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">Employee Management</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 ml-0'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-l-2 border-transparent'
              }
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        <div className={`flex items-center gap-3 mb-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">{initials}</span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden animate-fadeIn">
              <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`
            flex items-center gap-3 w-full px-3 py-2 rounded-lg
            text-slate-400 hover:text-rose-400 hover:bg-rose-500/10
            transition-all duration-200 cursor-pointer
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen z-40">
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 animate-slideIn">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
