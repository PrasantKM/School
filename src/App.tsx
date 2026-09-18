import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Dashboards
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';

// Modules
import { StudentRegistration } from './components/students/StudentRegistration';
import { StudentAttendance } from './components/attendance/StudentAttendance';
import { TeacherAttendance } from './components/attendance/TeacherAttendance';
import { HomeworkManagement } from './components/homework/HomeworkManagement';
import { MessagingCenter } from './components/messaging/MessagingCenter';
import { ExamScorecardView } from './components/exams/ExamScorecardView';
import { FeeManagement } from './components/fees/FeeManagement';

const SchoolApp: React.FC = () => {
  const { currentRole, activeTab, deviceMode } = useSchool();

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentRole === 'admin') return <AdminDashboard />;
        if (currentRole === 'teacher') return <TeacherDashboard />;
        return <ParentDashboard />;

      case 'students':
        return <StudentRegistration />;

      case 'student-attendance':
        return <StudentAttendance />;

      case 'teacher-attendance':
        return <TeacherAttendance />;

      case 'homework':
        return <HomeworkManagement />;

      case 'messaging':
      case 'announcements':
        return <MessagingCenter />;

      case 'scorecards':
        return <ExamScorecardView />;

      case 'fees':
        return <FeeManagement />;

      default:
        return <AdminDashboard />;
    }
  };

  // If in simulated mobile mode on a desktop screen, wrap in an elegant mobile frame
  if (deviceMode === 'mobile') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 sm:p-6 select-none">
        {/* Mockup phone container */}
        <div className="w-full sm:max-w-[420px] h-screen sm:h-[860px] bg-slate-50 sm:rounded-[40px] shadow-2xl border-0 sm:border-[8px] sm:border-slate-800 flex flex-col overflow-hidden relative">
          {/* Top Speaker & Camera Notch (desktop only) */}
          <div className="hidden sm:flex justify-center pt-2 pb-1 bg-white z-40">
            <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 mr-2" />
              <div className="w-8 h-1.5 rounded-full bg-slate-700" />
            </div>
          </div>

          {/* Mobile Top Navigation */}
          <Navbar />

          {/* Scrollable Mobile Content */}
          <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {renderActiveModule()}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav />
        </div>
      </div>
    );
  }

  // Standard Desktop / Responsive Web Layout
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <Navbar />

      {/* Main workspace layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar on md+ screens */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Dynamic module content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {renderActiveModule()}
        </main>
      </div>

      {/* Bottom bar on small screens (<md) */}
      <div className="md:hidden sticky bottom-0 z-30">
        <MobileNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <SchoolApp />
    </SchoolProvider>
  );
}
