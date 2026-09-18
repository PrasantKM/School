import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  CalendarCheck,
  BookOpen,
  Award,
  CreditCard,
  MessageSquare,
  ArrowRight,
  User,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const {
    activeStudent,
    studentAttendance,
    homeworks,
    scorecards,
    feeInvoices,
    setActiveTab,
    unreadMessageCount,
  } = useSchool();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = studentAttendance.find(
    (r) => r.studentId === activeStudent.studentId && r.date === todayStr
  );

  // Overall attendance calculation
  const childAttendanceHistory = studentAttendance.filter((r) => r.studentId === activeStudent.studentId);
  const presentDays = childAttendanceHistory.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const totalDays = childAttendanceHistory.length || 1;
  const overallAttendanceRate = Math.round((presentDays / totalDays) * 100);

  // Homework breakdown
  const childHomeworks = homeworks.filter((hw) => hw.grade === activeStudent.grade);
  const pendingHomework = childHomeworks.filter(
    (hw) => !hw.submissions.some((s) => s.studentId === activeStudent.studentId)
  );

  // Latest scorecard
  const latestScorecard = scorecards.find((sc) => sc.studentId === activeStudent.studentId);

  // Pending fee
  const pendingFee = feeInvoices.find(
    (f) => f.studentId === activeStudent.studentId && f.status === 'Pending'
  );

  return (
    <div className="space-y-6">
      {/* Child Summary Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center font-bold text-2xl text-emerald-300 shadow-inner shrink-0">
              {activeStudent.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/20">
                  Student Profile
                </span>
                <span className="text-xs text-emerald-200">ID: {activeStudent.studentId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
                {activeStudent.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
                Grade {activeStudent.grade} - Section {activeStudent.section} • Roll No: {activeStudent.rollNo} • Guardian: {activeStudent.guardianName}
              </p>
            </div>
          </div>

          {/* Today's Status Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-white shrink-0 min-w-[220px]">
            <div className="text-xs text-emerald-200 font-medium">Today's Campus Check-in</div>
            <div className="flex items-center gap-2 mt-1.5">
              {todayAttendance?.status === 'Present' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-base text-emerald-300">Present in Class</span>
                </>
              ) : todayAttendance?.status === 'Late' ? (
                <>
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="font-bold text-base text-amber-300">Marked Late</span>
                </>
              ) : todayAttendance?.status === 'Excused' ? (
                <>
                  <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="font-bold text-base text-blue-300">Excused Absence</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-base text-emerald-300">Present (Standard)</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-1">
              Class Teacher: Mrs. Eleanor Vance
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row for Parent */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Attendance Rate */}
        <div
          onClick={() => setActiveTab('student-attendance')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Overall Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{overallAttendanceRate}%</p>
          <span className="text-xs text-emerald-600 group-hover:underline font-medium inline-flex items-center mt-1">
            View attendance calendar <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        {/* Pending Homework */}
        <div
          onClick={() => setActiveTab('homework')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending Homework</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {pendingHomework.length} {pendingHomework.length === 1 ? 'Assignment' : 'Assignments'}
          </p>
          <span className="text-xs text-amber-600 group-hover:underline font-medium inline-flex items-center mt-1">
            Submit homework <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        {/* Latest GPA & Report */}
        <div
          onClick={() => setActiveTab('scorecards')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Latest Mid-Term GPA</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {latestScorecard ? `${latestScorecard.gpa} / 4.0` : '3.92'}
          </p>
          <span className="text-xs text-indigo-600 group-hover:underline font-medium inline-flex items-center mt-1">
            View full report card <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>

        {/* Fee Status */}
        <div
          onClick={() => setActiveTab('fees')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Tuition Dues</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {pendingFee ? `$${pendingFee.totalAmount}` : 'All Paid'}
          </p>
          <span className="text-xs text-rose-600 group-hover:underline font-medium inline-flex items-center mt-1">
            {pendingFee ? 'Pay online now' : 'View fee receipts'} <ChevronRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Main Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Homework list & Scorecard Summary */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Current Homework Tasks */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Homework & Projects</h3>
                <p className="text-xs text-slate-500">Track deadlines, submit solutions, and review teacher scores</p>
              </div>
              <button
                onClick={() => setActiveTab('homework')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                All Homework <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {childHomeworks.slice(0, 3).map((hw) => {
                const sub = hw.submissions.find((s) => s.studentId === activeStudent.studentId);
                return (
                  <div
                    key={hw.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          {hw.subject}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{hw.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{hw.description}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Due Date: <span className="font-medium text-slate-600">{hw.dueDate}</span> • Assigned by {hw.teacherName}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {sub?.status === 'Graded' ? (
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            Score: {sub.score} / {hw.maxMarks}
                          </span>
                          <p className="text-[10px] text-emerald-700 mt-0.5 font-medium">Graded by Teacher</p>
                        </div>
                      ) : sub?.status === 'Submitted' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          Under Evaluation
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveTab('homework')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                        >
                          Submit Online
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Scorecard Highlight */}
          {latestScorecard && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{latestScorecard.examName}</h3>
                  <p className="text-xs text-slate-500">Official Gradecard • Overall Rank #{latestScorecard.rank}</p>
                </div>
                <button
                  onClick={() => setActiveTab('scorecards')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Print Official Card
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {latestScorecard.scores.map((sc) => (
                  <div key={sc.subject} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70">
                    <p className="text-xs font-semibold text-slate-700 truncate">{sc.subject}</p>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-lg font-bold text-slate-900">
                        {sc.marksObtained}
                        <span className="text-xs text-slate-400 font-normal">/{sc.totalMarks}</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Grade {sc.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900">Class Teacher Remarks: </span>
                <span className="text-slate-600 italic">"{latestScorecard.teacherRemarks}"</span>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Teacher Dialogue & School Notices */}
        <div className="space-y-6">
          
          {/* Direct Communication with Teacher */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Class Teacher Contact</h3>
              <button
                onClick={() => setActiveTab('messaging')}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Send Message
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                EV
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-slate-900 text-xs">Mrs. Eleanor Vance</h4>
                <p className="text-[11px] text-slate-500 truncate">Class 10-A Advisor & Math Faculty</p>
                <p className="text-[10px] text-indigo-700 font-medium mt-0.5">Office Hours: 3:30 - 4:30 PM</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('messaging')}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              Direct Message Teacher
            </button>
          </div>

          {/* Pending Fee Banner */}
          {pendingFee && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-950 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  School Fee Due
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                  {pendingFee.term}
                </span>
              </div>
              <p className="text-amber-800">
                Due amount: <span className="font-bold text-base text-slate-900">${pendingFee.totalAmount}</span>
              </p>
              <p className="text-[11px] text-amber-700">Due date: {pendingFee.dueDate}</p>
              <button
                onClick={() => setActiveTab('fees')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors shadow-xs"
              >
                Pay Online & Download Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
