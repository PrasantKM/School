import React from 'react';
import { useSchool, NavigationTab } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  Award,
  CreditCard,
  Users,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentRole, activeTab, setActiveTab, unreadMessageCount, pendingHomeworkCount } = useSchool();

  const getMobileTabs = (): { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] => {
    switch (currentRole) {
      case 'parent':
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'student-attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'homework', label: 'Homework', icon: BookOpen, badge: pendingHomeworkCount },
          { id: 'messaging', label: 'Messages', icon: MessageSquare, badge: unreadMessageCount },
          { id: 'scorecards', label: 'Scorecard', icon: Award },
          { id: 'fees', label: 'Fees', icon: CreditCard },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'student-attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'homework', label: 'Homework', icon: BookOpen, badge: pendingHomeworkCount },
          { id: 'messaging', label: 'Messages', icon: MessageSquare, badge: unreadMessageCount },
          { id: 'scorecards', label: 'Grades', icon: Award },
          { id: 'students', label: 'Students', icon: Users },
        ];
      case 'admin':
      default:
        return [
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'student-attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'homework', label: 'Homework', icon: BookOpen },
          { id: 'messaging', label: 'Notices', icon: MessageSquare, badge: unreadMessageCount },
          { id: 'fees', label: 'Fees', icon: CreditCard },
        ];
    }
  };

  const tabs = getMobileTabs();

  return (
    <div className="bg-white border-t border-slate-200 px-2 py-1 flex items-center justify-around z-30 shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg relative transition-all min-w-[52px] ${
              isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
