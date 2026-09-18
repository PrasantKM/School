import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  BookOpen,
  Clock,
  UserPlus,
  Bell,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    teachers,
    studentAttendance,
    feeInvoices,
    homeworks,
    leaveRequests,
    announcements,
    setActiveTab,
  } = useSchool();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = studentAttendance.filter((r) => r.date === todayStr);

  const presentCount = todayAttendance.filter((r) => r.status === 'Present').length;
  const lateCount = todayAttendance.filter((r) => r.status === 'Late').length;
  const absentCount = todayAttendance.filter((r) => r.status === 'Absent').length;
  const excusedCount = todayAttendance.filter((r) => r.status === 'Excused').length;

  const totalRecorded = todayAttendance.length;
  const attendanceRate = totalRecorded > 0 ? Math.round(((presentCount + lateCount) / totalRecorded) * 100) : 95;

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const totalFeesPending = feeInvoices
    .filter((f) => f.status === 'Pending')
    .reduce((acc, f) => acc + (f.totalAmount - f.amountPaid), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Oakridge Central Administration Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Academic Oversight Dashboard</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Real-time monitoring of student registrations, attendance compliance, homework assignments, communications, and fee collection.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('students')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Register Student
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4" />
              Broadcast Notice
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">{students.length}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span className="text-emerald-600 font-semibold flex items-center">
              100% Active <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
            <span>across 3 grades</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Staff</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">{teachers.length}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span className="text-slate-700 font-medium">All departments staffed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Attendance</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">{attendanceRate}%</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span className="text-emerald-600 font-medium">{presentCount} present</span>
            <span>•</span>
            <span className="text-amber-600 font-medium">{lateCount} late</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Dues</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">${totalFeesPending.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span className="text-amber-600 font-medium">Term 2 pending invoices</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Attendance Breakdown & Class Distribution */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Attendance Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Today's Attendance Status</h3>
                <p className="text-xs text-slate-500">Real-time check-in records for current academic day</p>
              </div>
              <button
                onClick={() => setActiveTab('student-attendance')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Open Attendance Roster <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-lg p-3 text-center">
                <p className="text-xs text-emerald-700 font-medium">Present</p>
                <p className="text-xl font-bold text-emerald-800 mt-0.5">{presentCount}</p>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-lg p-3 text-center">
                <p className="text-xs text-amber-700 font-medium">Late</p>
                <p className="text-xl font-bold text-amber-800 mt-0.5">{lateCount}</p>
              </div>
              <div className="bg-rose-50/80 border border-rose-100 rounded-lg p-3 text-center">
                <p className="text-xs text-rose-700 font-medium">Absent</p>
                <p className="text-xl font-bold text-rose-800 mt-0.5">{absentCount}</p>
              </div>
              <div className="bg-blue-50/80 border border-blue-100 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-700 font-medium">Excused</p>
                <p className="text-xl font-bold text-blue-800 mt-0.5">{excusedCount}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Overall Daily Attendance Ratio</span>
                <span className="font-semibold text-slate-900">{attendanceRate}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${(presentCount / (totalRecorded || 1)) * 100}%` }} className="bg-emerald-500 h-full" title="Present" />
                <div style={{ width: `${(lateCount / (totalRecorded || 1)) * 100}%` }} className="bg-amber-400 h-full" title="Late" />
                <div style={{ width: `${(excusedCount / (totalRecorded || 1)) * 100}%` }} className="bg-blue-400 h-full" title="Excused" />
                <div style={{ width: `${(absentCount / (totalRecorded || 1)) * 100}%` }} className="bg-rose-400 h-full" title="Absent" />
              </div>
            </div>
          </div>

          {/* Quick Enrolled Classes Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Class Enrollments</h3>
                <p className="text-xs text-slate-500">Active sections and class teacher assignments</p>
              </div>
              <button
                onClick={() => setActiveTab('students')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View All Directory
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Grade & Section</th>
                    <th className="px-5 py-3">Class Teacher</th>
                    <th className="px-5 py-3">Enrolled Count</th>
                    <th className="px-5 py-3">Attendance Rate</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-bold text-slate-900">Grade 10 - Section A</td>
                    <td className="px-5 py-3 text-slate-600">Mrs. Eleanor Vance</td>
                    <td className="px-5 py-3 font-semibold text-slate-700">5 Students</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        96% High
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setActiveTab('students')}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-bold text-slate-900">Grade 9 - Section B</td>
                    <td className="px-5 py-3 text-slate-600">Mr. David Miller</td>
                    <td className="px-5 py-3 font-semibold text-slate-700">2 Students</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        94% Stable
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setActiveTab('students')}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-bold text-slate-900">Grade 8 - Section A</td>
                    <td className="px-5 py-3 text-slate-600">Dr. Marcus Brody</td>
                    <td className="px-5 py-3 font-semibold text-slate-700">1 Student</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        98% High
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setActiveTab('students')}
                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Action Cards & Notices */}
        <div className="space-y-6">
          {/* Quick Action Buttons */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Administrative Quick Actions</h3>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => setActiveTab('students')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-700 hover:text-indigo-900 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold">Register New Student</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('student-attendance')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-700 hover:text-emerald-900 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Mark Student Attendance</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('teacher-attendance')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-700 hover:text-amber-900 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold">Teacher Leaves ({pendingLeaves} Pending)</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('scorecards')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 text-slate-700 hover:text-purple-900 transition-all text-left"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold">Exam Scorecards & GPA</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Active Announcements */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Active School Notices</h3>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Manage
              </button>
            </div>
            <div className="space-y-2.5">
              {announcements.slice(0, 3).map((ann) => (
                <div key={ann.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 line-clamp-1">{ann.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{ann.date}</span>
                  </div>
                  <p className="text-slate-500 mt-1 line-clamp-2 text-[11px] leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
