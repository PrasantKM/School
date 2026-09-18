import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Clock,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Plus,
  Check,
  X,
  Calendar,
} from 'lucide-react';
import { LeaveRequest } from '../../types';

export const TeacherAttendance: React.FC = () => {
  const {
    teachers,
    teacherAttendance,
    leaveRequests,
    currentRole,
    activeTeacher,
    clockInTeacher,
    clockOutTeacher,
    applyLeaveRequest,
    updateLeaveStatus,
  } = useSchool();

  const todayStr = new Date().toISOString().split('T')[0];
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves'>('attendance');

  // Form for leave application
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Casual Leave' as LeaveRequest['leaveType'],
    startDate: todayStr,
    endDate: todayStr,
    reason: '',
  });

  const myTodayRecord = teacherAttendance.find(
    (t) => t.teacherId === activeTeacher.teacherId && t.date === todayStr
  );

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.reason.trim()) return;

    applyLeaveRequest({
      teacherId: activeTeacher.teacherId,
      teacherName: activeTeacher.fullName,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      reason: leaveForm.reason,
    });

    setIsLeaveModalOpen(false);
    setLeaveForm({
      leaveType: 'Casual Leave',
      startDate: todayStr,
      endDate: todayStr,
      reason: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Teacher Attendance & Leave Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daily faculty clock-in, duty hours tracking, and leave application workflow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'attendance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Attendance Roster
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'leaves' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Leave Requests ({leaveRequests.filter((l) => l.status === 'Pending').length})
            </button>
          </div>

          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Teacher Self-Clock In Banner (Shown for Teacher role) */}
      {currentRole === 'teacher' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{activeTeacher.fullName}</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                  {activeTeacher.teacherId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Today: <strong className="text-slate-700">{todayStr}</strong> • Workstation Status:{' '}
                {myTodayRecord?.clockInTime ? (
                  <span className="text-emerald-600 font-semibold">Clocked In at {myTodayRecord.clockInTime}</span>
                ) : (
                  <span className="text-amber-600 font-semibold">Not Clocked In Yet</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!myTodayRecord?.clockInTime ? (
              <button
                onClick={() => clockInTeacher(activeTeacher.teacherId)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-xs transition-colors"
              >
                Clock In Now
              </button>
            ) : !myTodayRecord?.clockOutTime ? (
              <button
                onClick={() => clockOutTeacher(activeTeacher.teacherId)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-semibold px-5 py-2 rounded-xl shadow-xs transition-colors"
              >
                Clock Out (End Shift)
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Shift Completed (8.0 hrs)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      {activeTab === 'attendance' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Faculty Daily Attendance Sheet</h3>
              <p className="text-xs text-slate-500">Record of teacher check-ins, departures, and working hours</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-600">Date: {todayStr}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">Teacher Name & ID</th>
                  <th className="px-5 py-3.5">Subject / Department</th>
                  <th className="px-5 py-3.5">Assigned Classes</th>
                  <th className="px-5 py-3.5">Clock-In Time</th>
                  <th className="px-5 py-3.5">Clock-Out Time</th>
                  <th className="px-5 py-3.5">Hours</th>
                  <th className="px-5 py-3.5">Status</th>
                  {currentRole === 'admin' && <th className="px-5 py-3.5 text-right">Admin Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((teacher) => {
                  const rec = teacherAttendance.find(
                    (t) => t.teacherId === teacher.teacherId && t.date === todayStr
                  );

                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm">{teacher.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{teacher.teacherId}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-700 font-medium">{teacher.subject}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {teacher.assignedClasses.map((cls) => (
                            <span
                              key={cls}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-medium text-slate-800">
                        {rec?.clockInTime || '--:--'}
                      </td>
                      <td className="px-5 py-4 font-mono font-medium text-slate-800">
                        {rec?.clockOutTime || '--:--'}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {rec?.workingHours ? `${rec.workingHours} hrs` : '--'}
                      </td>
                      <td className="px-5 py-4">
                        {rec?.status === 'Present' && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Present
                          </span>
                        )}
                        {rec?.status === 'Late' && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Late Arrival
                          </span>
                        )}
                        {rec?.status === 'On Leave' && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            On Leave
                          </span>
                        )}
                        {!rec && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                            Not Checked In
                          </span>
                        )}
                      </td>
                      {currentRole === 'admin' && (
                        <td className="px-5 py-4 text-right">
                          {!rec?.clockInTime ? (
                            <button
                              onClick={() => clockInTeacher(teacher.teacherId)}
                              className="text-xs text-indigo-600 hover:text-indigo-900 font-semibold"
                            >
                              Force Clock-In
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Logged</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Leave Requests Management */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Faculty Leave Applications</h3>
              <p className="text-xs text-slate-500">Official leave requests and administrator decision log</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Teacher</th>
                  <th className="px-5 py-3">Leave Type</th>
                  <th className="px-5 py-3">Duration (From - To)</th>
                  <th className="px-5 py-3">Reason / Justification</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 font-bold text-slate-900">{leave.teacherName}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {leave.startDate} → {leave.endDate}
                    </td>
                    <td className="px-5 py-4 text-slate-600 max-w-xs">{leave.reason}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : leave.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {leave.status === 'Pending' && currentRole === 'admin' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'Approved')}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Approve Leave"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'Rejected')}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Reject Leave"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Application Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Submit Leave Application</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Leave Category</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveRequest['leaveType'] })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Medical / Sick Leave</option>
                  <option value="Professional Development">Professional Development / Symposium</option>
                  <option value="Maternity/Paternity">Maternity/Paternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason & Remarks *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide brief context for administrative approval..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
