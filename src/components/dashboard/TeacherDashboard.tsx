import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  CalendarCheck,
  BookOpen,
  MessageSquare,
  Clock,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    activeTeacher,
    studentAttendance,
    homeworks,
    messages,
    teacherAttendance,
    clockInTeacher,
    clockOutTeacher,
    setActiveTab,
    pendingHomeworkCount,
    unreadMessageCount,
  } = useSchool();

  const todayStr = new Date().toISOString().split('T')[0];
  const myAttendanceToday = teacherAttendance.find(
    (t) => t.teacherId === activeTeacher.teacherId && t.date === todayStr
  );

  const grade10AttendanceToday = studentAttendance.filter(
    (r) => r.grade === '10' && r.section === 'A' && r.date === todayStr
  );

  const presentCount = grade10AttendanceToday.filter((r) => r.status === 'Present').length;
  const totalCount = grade10AttendanceToday.length;

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/20">
                Faculty Portal
              </span>
              <span className="text-xs text-indigo-200">ID: {activeTeacher.teacherId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Good day, {activeTeacher.fullName}
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl">
              {activeTeacher.designation} • Ready for today's lectures in Mathematics & Analytical Geometry.
            </p>
          </div>

          {/* Teacher Clock-In / Out Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-white min-w-[240px] shrink-0">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-indigo-200 font-medium">Daily Clock-In</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[11px] border border-emerald-400/30">
                {myAttendanceToday?.clockInTime ? 'Checked In' : 'Not Marked'}
              </span>
            </div>
            <div className="text-xl font-bold font-mono">
              {myAttendanceToday?.clockInTime || '--:-- --'}
            </div>
            <p className="text-[11px] text-indigo-200 mt-0.5">
              {myAttendanceToday?.clockOutTime ? `Clocked out at ${myAttendanceToday.clockOutTime}` : 'Campus Terminal active'}
            </p>
            <div className="mt-3 pt-2 border-t border-white/15 flex gap-2">
              {!myAttendanceToday?.clockInTime ? (
                <button
                  onClick={() => clockInTeacher(activeTeacher.teacherId)}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors shadow-xs"
                >
                  Clock In Now
                </button>
              ) : !myAttendanceToday?.clockOutTime ? (
                <button
                  onClick={() => clockOutTeacher(activeTeacher.teacherId)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors shadow-xs"
                >
                  Clock Out
                </button>
              ) : (
                <span className="text-xs text-indigo-200 py-1 font-medium">Workday completed (8.0 hrs)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => setActiveTab('student-attendance')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Class 10-A Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {presentCount} / {totalCount || 5} Present
          </p>
          <span className="text-xs text-indigo-600 group-hover:underline font-medium inline-flex items-center mt-1">
            Update roll call <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('homework')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Grading</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{pendingHomeworkCount} Submissions</p>
          <span className="text-xs text-amber-600 group-hover:underline font-medium inline-flex items-center mt-1">
            Evaluate homework <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('messaging')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Parent Messages</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{unreadMessageCount} Unread</p>
          <span className="text-xs text-indigo-600 group-hover:underline font-medium inline-flex items-center mt-1">
            Open messenger <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('scorecards')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Mid-Term Gradebook</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">Class Avg 89%</p>
          <span className="text-xs text-purple-600 group-hover:underline font-medium inline-flex items-center mt-1">
            View report cards <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Main Teacher Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Schedule & Active Homeworks */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Teaching Schedule */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-4">Today's Teaching Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-indigo-100 bg-indigo-50/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex flex-col items-center justify-center font-bold text-xs">
                    <span>08:30</span>
                    <span className="text-[9px] font-normal opacity-80">AM</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Advanced Algebra & Quadratic Roots</h4>
                    <p className="text-xs text-slate-500">Grade 10 - Section A • Room 204</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex flex-col items-center justify-center font-bold text-xs">
                    <span>11:00</span>
                    <span className="text-[9px] font-normal opacity-80">AM</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Coordinate Geometry & Linear Graphs</h4>
                    <p className="text-xs text-slate-500">Grade 9 - Section B • Room 108</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                  Upcoming
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex flex-col items-center justify-center font-bold text-xs">
                    <span>01:45</span>
                    <span className="text-[9px] font-normal opacity-80">PM</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Math Olympiad Special Mentorship</h4>
                    <p className="text-xs text-slate-500">Selected Candidates • STEM Resource Lab</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  Afternoon
                </span>
              </div>
            </div>
          </div>

          {/* Submissions Needing Review */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Homework Submissions Waiting for Review</h3>
                <p className="text-xs text-slate-500">Student work submitted online requiring score & feedback</p>
              </div>
              <button
                onClick={() => setActiveTab('homework')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Manage All Homework <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {homeworks.flatMap((hw) =>
                hw.submissions
                  .filter((sub) => sub.status === 'Submitted')
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{sub.studentName}</span>
                          <span className="text-xs text-slate-500">• {hw.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">"{sub.content}"</p>
                        <p className="text-[11px] text-slate-400 mt-1">Submitted at {sub.submittedAt}</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('homework')}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        Grade Submission
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Parent Messages */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Recent Parent Dialogues</h3>
              <button
                onClick={() => setActiveTab('messaging')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                View Thread
              </button>
            </div>
            <div className="space-y-3">
              {messages.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  onClick={() => setActiveTab('messaging')}
                  className="p-3 rounded-lg bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{m.senderName}</span>
                    <span className="text-[10px] text-slate-400">{m.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="font-medium text-slate-700 mt-1 line-clamp-1">{m.subject}</p>
                  <p className="text-slate-500 text-[11px] line-clamp-2 mt-0.5">{m.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 text-xs text-indigo-900 space-y-2">
            <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-indigo-600" />
              Upcoming Academic Deadlines
            </h4>
            <ul className="space-y-1.5 text-indigo-800">
              <li>• Mid-term report card sign-offs: Oct 12</li>
              <li>• Parent-Teacher Conference bookings: Oct 5</li>
              <li>• Science Fair evaluation submissions: Oct 15</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
