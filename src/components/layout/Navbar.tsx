import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  GraduationCap,
  Shield,
  UserCheck,
  Users,
  Smartphone,
  Monitor,
  Bell,
  MessageSquare,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Role } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    deviceMode,
    setDeviceMode,
    activeStudent,
    setActiveStudentId,
    students,
    unreadMessageCount,
    pendingHomeworkCount,
    setActiveTab,
    resetToDefaultData,
  } = useSchool();

  const roleOptions: { id: Role; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
    { id: 'admin', label: 'Admin Portal', icon: Shield, desc: 'School administration & registration' },
    { id: 'teacher', label: 'Teacher Portal', icon: UserCheck, desc: 'Attendance, homework & grades' },
    { id: 'parent', label: 'Parent Portal', icon: Users, desc: "Child progress & communication" },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg leading-tight tracking-tight">Oakridge Academy</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  SMS 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Integrated School Management System</p>
            </div>
          </div>

          {/* Center: Device Mode Preview Switcher */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop View
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile App Mode
            </button>
          </div>

          {/* Right: Quick actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* If Parent role, allow switching active child */}
            {currentRole === 'parent' && (
              <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 text-xs">
                <span className="text-amber-800 font-medium">Student:</span>
                <select
                  value={activeStudent.id}
                  onChange={(e) => setActiveStudentId(e.target.value)}
                  className="bg-transparent text-amber-900 font-semibold focus:outline-none cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.grade}-{s.section})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick unread message notification */}
            <button
              onClick={() => setActiveTab('messaging')}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
              title="Messaging & Notifications"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessageCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadMessageCount}
                </span>
              )}
            </button>

            {/* Announcements quick link */}
            <button
              onClick={() => setActiveTab('announcements')}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors hidden sm:flex"
              title="School Announcements"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                const isActive = currentRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      setCurrentRole(role.id);
                      setActiveTab('dashboard');
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? role.id === 'admin'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : role.id === 'teacher'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{role.label.replace(' Portal', '')}</span>
                  </button>
                );
              })}
            </div>

            {/* Reset data helper */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data (students, attendance, homework) to defaults?')) {
                  resetToDefaultData();
                }
              }}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
