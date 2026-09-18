import React from 'react';
import { useSchool, NavigationTab } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  UserPlus,
  CalendarCheck,
  Clock,
  BookOpen,
  MessageSquare,
  Award,
  CreditCard,
  Bell,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, unreadMessageCount, pendingHomeworkCount, activeStudent, activeTeacher } =
    useSchool();

  interface NavItem {
    id: NavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }

  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Student Registration', icon: UserPlus },
          { id: 'student-attendance', label: 'Student Attendance', icon: CalendarCheck },
          { id: 'teacher-attendance', label: 'Teacher Attendance', icon: Clock },
          { id: 'homework', label: 'Homework Management', icon: BookOpen },
          {
            id: 'messaging',
            label: 'Messaging & Notices',
            icon: MessageSquare,
            badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
            badgeColor: 'bg-indigo-600 text-white',
          },
          { id: 'scorecards', label: 'Exam Scorecards', icon: Award },
          { id: 'fees', label: 'Fee Management', icon: CreditCard },
          { id: 'announcements', label: 'Announcements', icon: Bell },
        ];

      case 'teacher':
        return [
          { id: 'dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
          { id: 'student-attendance', label: 'Mark Student Attendance', icon: CalendarCheck },
          { id: 'teacher-attendance', label: 'My Attendance & Leaves', icon: Clock },
          {
            id: 'homework',
            label: 'Homework Management',
            icon: BookOpen,
            badge: pendingHomeworkCount > 0 ? `${pendingHomeworkCount} to grade` : undefined,
            badgeColor: 'bg-amber-500 text-white',
          },
          {
            id: 'messaging',
            label: 'Parent Communication',
            icon: MessageSquare,
            badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
            badgeColor: 'bg-indigo-600 text-white',
          },
          { id: 'scorecards', label: 'Gradebook & Scorecards', icon: Award },
          { id: 'students', label: 'Student Profiles', icon: UserPlus },
          { id: 'announcements', label: 'School Notices', icon: Bell },
        ];

      case 'parent':
        return [
          { id: 'dashboard', label: 'Student Summary', icon: LayoutDashboard },
          { id: 'student-attendance', label: 'Attendance Record', icon: CalendarCheck },
          {
            id: 'homework',
            label: 'Homework & Submissions',
            icon: BookOpen,
            badge: pendingHomeworkCount > 0 ? `${pendingHomeworkCount} pending` : undefined,
            badgeColor: 'bg-rose-500 text-white',
          },
          {
            id: 'messaging',
            label: 'Teacher Messages',
            icon: MessageSquare,
            badge: unreadMessageCount > 0 ? unreadMessageCount : undefined,
            badgeColor: 'bg-indigo-600 text-white',
          },
          { id: 'scorecards', label: 'Report Cards & Grades', icon: Award },
          { id: 'fees', label: 'School Fees & Receipts', icon: CreditCard },
          { id: 'announcements', label: 'School Announcements', icon: Bell },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Active Profile Info Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 ${
              currentRole === 'admin'
                ? 'bg-slate-800'
                : currentRole === 'teacher'
                ? 'bg-indigo-600'
                : 'bg-emerald-600'
            }`}
          >
            {currentRole === 'admin' && 'AD'}
            {currentRole === 'teacher' && 'EV'}
            {currentRole === 'parent' && 'RC'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {currentRole === 'admin' && 'System Administrator'}
              {currentRole === 'teacher' && activeTeacher.fullName}
              {currentRole === 'parent' && `${activeStudent.guardianName}`}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {currentRole === 'admin' && 'Central School Admin'}
              {currentRole === 'teacher' && 'Math & Grade 10-A Advisor'}
              {currentRole === 'parent' && `Parent of ${activeStudent.fullName} (10-A)`}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Navigation Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.badgeColor || 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info badge */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/30">
        <div className="rounded-lg bg-indigo-50/60 border border-indigo-100/80 p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-indigo-900">Academic Year</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-200/60 text-indigo-800 rounded font-medium">
              2025–2026
            </span>
          </div>
          <p className="text-[11px] text-indigo-700/80 mt-1">Term 1 • Active Session</p>
        </div>
      </div>
    </aside>
  );
};
