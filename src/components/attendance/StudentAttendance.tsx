import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  Filter,
  Users,
  Check,
  Download,
  Share2,
} from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const {
    students,
    studentAttendance,
    markStudentAttendance,
    bulkMarkAttendance,
    currentRole,
    activeStudent,
    activeTeacher,
  } = useSchool();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedGrade, setSelectedGrade] = useState('10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [viewMode, setViewMode] = useState<'mark' | 'history'>('mark');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'present' | 'absent' | 'late'>('all');

  // Filter students for the current grade/section
  const classStudents = students.filter(
    (s) => s.grade === selectedGrade && s.section === selectedSection
  );

  // Status mapping for the selected date
  const getRecordForStudent = (studentId: string, date: string) => {
    return studentAttendance.find((r) => r.studentId === studentId && r.date === date);
  };

  // Local state for the current marking session
  const [pendingRemarks, setPendingRemarks] = useState<{ [studentId: string]: string }>({});

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    markStudentAttendance({
      studentId,
      date: selectedDate,
      grade: selectedGrade,
      section: selectedSection,
      status,
      remarks: pendingRemarks[studentId] || undefined,
      markedBy: currentRole === 'teacher' ? activeTeacher.fullName : 'Central Administration',
    });
  };

  const handleMarkAllPresent = () => {
    const bulk = classStudents.map((s) => ({
      studentId: s.studentId,
      date: selectedDate,
      grade: selectedGrade,
      section: selectedSection,
      status: 'Present' as AttendanceStatus,
      remarks: pendingRemarks[s.studentId] || undefined,
      markedBy: currentRole === 'teacher' ? activeTeacher.fullName : 'Central Administration',
    }));
    bulkMarkAttendance(bulk);
  };

  // Stats for current date & class
  const classRecordsToday = classStudents.map((s) => getRecordForStudent(s.studentId, selectedDate));
  const presentCount = classRecordsToday.filter((r) => r?.status === 'Present').length;
  const lateCount = classRecordsToday.filter((r) => r?.status === 'Late').length;
  const absentCount = classRecordsToday.filter((r) => r?.status === 'Absent').length;
  const excusedCount = classRecordsToday.filter((r) => r?.status === 'Excused').length;
  const unmarkedCount = classStudents.length - (presentCount + lateCount + absentCount + excusedCount);

  // If Parent role, show focused view for active student
  if (currentRole === 'parent') {
    const childHistory = studentAttendance
      .filter((r) => r.studentId === activeStudent.studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalDays = childHistory.length || 1;
    const presentDays = childHistory.filter((r) => r.status === 'Present' || r.status === 'Late').length;
    const rate = Math.round((presentDays / totalDays) * 100);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Attendance History for {activeStudent.fullName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Grade {activeStudent.grade}-{activeStudent.section} • Roll No: {activeStudent.rollNo}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Attendance Rate</span>
              <span className="text-xl font-bold text-emerald-800">{rate}%</span>
            </div>
          </div>
        </div>

        {/* Breakdown cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Days Present</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {childHistory.filter((r) => r.status === 'Present').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Late Arrivals</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {childHistory.filter((r) => r.status === 'Late').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Excused Absences</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {childHistory.filter((r) => r.status === 'Excused').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">Unexcused Absences</span>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {childHistory.filter((r) => r.status === 'Absent').length}
            </p>
          </div>
        </div>

        {/* Attendance Log Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Daily Attendance Ledger</h3>
            <span className="text-xs text-slate-400 font-mono">Current Academic Term</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Class Teacher Remarks</th>
                <th className="px-5 py-3">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {childHistory.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{record.date}</td>
                  <td className="px-5 py-3.5">
                    {record.status === 'Present' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Present
                      </span>
                    )}
                    {record.status === 'Late' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" /> Late
                      </span>
                    )}
                    {record.status === 'Excused' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <AlertCircle className="w-3.5 h-3.5" /> Excused
                      </span>
                    )}
                    {record.status === 'Absent' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> Absent
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 italic">
                    {record.remarks || 'Standard on-time attendance'}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{record.markedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Teacher / Admin Marking & History View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Student Attendance Roster
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Mark daily roll call, register exceptions (late, excused), and view class attendance records
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setViewMode('mark')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'mark' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attendance Logs & History
          </button>
        </div>
      </div>

      {/* Control Bar: Class, Section, Date */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Grade:</span>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
            >
              <option value="10">Grade 10</option>
              <option value="9">Grade 9</option>
              <option value="8">Grade 8</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium focus:outline-none"
            >
            </input>
          </div>
        </div>

        {viewMode === 'mark' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllPresent}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              Mark All Present
            </button>
          </div>
        )}
      </div>

      {/* Real-time Summary Cards for selected Date & Class */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Students</span>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{classStudents.length}</p>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] text-emerald-700 font-semibold uppercase">Present</span>
          <p className="text-xl font-bold text-emerald-800 mt-0.5">{presentCount}</p>
        </div>
        <div className="bg-amber-50/70 border border-amber-100 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] text-amber-700 font-semibold uppercase">Late</span>
          <p className="text-xl font-bold text-amber-800 mt-0.5">{lateCount}</p>
        </div>
        <div className="bg-rose-50/70 border border-rose-100 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] text-rose-700 font-semibold uppercase">Absent</span>
          <p className="text-xl font-bold text-rose-800 mt-0.5">{absentCount}</p>
        </div>
        <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-xl shadow-xs">
          <span className="text-[11px] text-blue-700 font-semibold uppercase">Excused</span>
          <p className="text-xl font-bold text-blue-800 mt-0.5">{excusedCount}</p>
        </div>
      </div>

      {viewMode === 'mark' ? (
        /* Attendance Marking Roster Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Daily Marking Roster (Grade {selectedGrade}-{selectedSection} • {selectedDate})
            </h3>
            <span className="text-xs text-slate-500">
              {unmarkedCount > 0 ? `${unmarkedCount} students unmarked` : 'All students recorded'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Roll No</th>
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-5 py-3">Mark Status</th>
                  <th className="px-5 py-3">Teacher Remarks / Notes</th>
                  <th className="px-5 py-3">Current Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((student) => {
                  const currentRec = getRecordForStudent(student.studentId, selectedDate);
                  const currentStatus = currentRec?.status;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-700">{student.rollNo}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{student.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{student.studentId}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'Present')}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'Late')}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'Late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'Excused')}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'Excused'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                          >
                            Excused
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.studentId, 'Absent')}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <input
                          type="text"
                          placeholder="Optional reason (e.g. Bus breakdown)"
                          defaultValue={currentRec?.remarks || ''}
                          onChange={(e) => {
                            setPendingRemarks({
                              ...pendingRemarks,
                              [student.studentId]: e.target.value,
                            });
                          }}
                          onBlur={(e) => {
                            if (currentStatus) {
                              markStudentAttendance({
                                studentId: student.studentId,
                                date: selectedDate,
                                grade: selectedGrade,
                                section: selectedSection,
                                status: currentStatus,
                                remarks: e.target.value,
                                markedBy: currentRole === 'teacher' ? activeTeacher.fullName : 'Admin',
                              });
                            }
                          }}
                          className="w-full px-2.5 py-1 text-xs rounded border border-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        {currentStatus ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : currentStatus === 'Late'
                                ? 'bg-amber-100 text-amber-800'
                                : currentStatus === 'Excused'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {currentStatus}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Unmarked</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* History & Reports Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              Historical Attendance Logs (Grade {selectedGrade}-{selectedSection})
            </h3>
            <span className="text-xs text-slate-500">All archived daily roll calls</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Class</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Remarks</th>
                  <th className="px-5 py-3">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentAttendance
                  .filter((r) => r.grade === selectedGrade && r.section === selectedSection)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record) => {
                    const student = students.find((s) => s.studentId === record.studentId);
                    return (
                      <tr key={record.id} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-medium text-slate-900">{record.date}</td>
                        <td className="px-5 py-3">
                          <div className="font-bold text-slate-900">{student?.fullName || record.studentId}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{record.studentId}</div>
                        </td>
                        <td className="px-5 py-3 font-medium text-slate-700">
                          {record.grade}-{record.section}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              record.status === 'Present'
                                ? 'bg-emerald-100 text-emerald-800'
                                : record.status === 'Late'
                                ? 'bg-amber-100 text-amber-800'
                                : record.status === 'Excused'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-600 italic">{record.remarks || '--'}</td>
                        <td className="px-5 py-3 text-slate-500">{record.markedBy}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
