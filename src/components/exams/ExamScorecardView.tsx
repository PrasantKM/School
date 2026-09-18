import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { ExamScorecard, SubjectScore } from '../../types';
import {
  Award,
  Download,
  Printer,
  Edit2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileCheck,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const ExamScorecardView: React.FC = () => {
  const {
    students,
    scorecards,
    saveOrUpdateScorecard,
    currentRole,
    activeStudent,
    activeTeacher,
  } = useSchool();

  const [selectedExamName, setSelectedExamName] = useState('Mid-Term Examination 2026');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    currentRole === 'parent' ? activeStudent.studentId : students[0]?.studentId || ''
  );

  const [isEditingMarks, setIsEditingMarks] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // Active student object
  const currentStudent =
    students.find((s) => s.studentId === selectedStudentId) ||
    (currentRole === 'parent' ? activeStudent : students[0]);

  // Find scorecard for this student and exam
  const currentCard = scorecards.find(
    (sc) => sc.studentId === currentStudent?.studentId && sc.examName === selectedExamName
  );

  // Edit form state
  const [editableScores, setEditableScores] = useState<SubjectScore[]>([]);
  const [teacherRemarks, setTeacherRemarks] = useState('');
  const [principalRemarks, setPrincipalRemarks] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<'Quarter 1' | 'Mid Term' | 'Quarter 3' | 'Final Term'>('Mid Term');

  const handleOpenEdit = () => {
    if (currentCard) {
      setEditableScores([...currentCard.scores]);
      setTeacherRemarks(currentCard.teacherRemarks || '');
      setPrincipalRemarks(currentCard.principalRemarks || '');
      setSelectedTerm(currentCard.term);
    } else {
      // Default initial marks template
      setEditableScores([
        { subject: 'Mathematics', marksObtained: 88, totalMarks: 100, grade: 'A', remarks: 'Exceptional problem solving' },
        { subject: 'Physics & Science', marksObtained: 84, totalMarks: 100, grade: 'A', remarks: 'Strong lab engagement' },
        { subject: 'English Literature', marksObtained: 90, totalMarks: 100, grade: 'A+', remarks: 'Insightful essay analysis' },
        { subject: 'Social Studies', marksObtained: 82, totalMarks: 100, grade: 'B+', remarks: 'Consistent project research' },
      ]);
      setTeacherRemarks('Exhibits strong academic curiosity and leadership in class discussions.');
      setPrincipalRemarks('Promoted with high honors. Exemplary conduct.');
      setSelectedTerm('Mid Term');
    }
    setIsEditingMarks(true);
  };

  const calculateSubjectGrade = (pct: number): string => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    return 'F';
  };

  const handleSaveScorecard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    const updatedScores = editableScores.map((s) => {
      const pct = (Number(s.marksObtained) / Number(s.totalMarks)) * 100;
      return {
        ...s,
        marksObtained: Number(s.marksObtained),
        grade: calculateSubjectGrade(pct),
      };
    });

    saveOrUpdateScorecard({
      studentId: currentStudent.studentId,
      examName: selectedExamName,
      academicYear: '2025-2026',
      grade: currentStudent.grade,
      section: currentStudent.section,
      term: selectedTerm,
      scores: updatedScores,
      rank: 2,
      attendancePercentage: 96,
      teacherRemarks,
      principalRemarks: principalRemarks || 'Promoted with commendable standing.',
      publishedDate: new Date().toISOString().split('T')[0],
    });

    setIsEditingMarks(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Academic Examinations & Scorecards
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluate subject benchmarks, generate student transcript reports, and track GPA metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {currentCard && (
            <button
              onClick={() => setIsPrintPreviewOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Official Transcript
            </button>
          )}

          {currentRole !== 'parent' && (
            <button
              onClick={handleOpenEdit}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
            >
              {currentCard ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {currentCard ? 'Update Scorecard' : 'Enter Exam Marks'}
            </button>
          )}
        </div>
      </div>

      {/* Control Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Exam Series:</span>
            <select
              value={selectedExamName}
              onChange={(e) => setSelectedExamName(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
            >
              <option value="Mid-Term Examination 2026">Mid-Term Examination 2026</option>
              <option value="First Terminal Assessment 2025">First Terminal Assessment 2025</option>
              <option value="Final Board Mock Exam 2026">Final Board Mock Exam 2026</option>
            </select>
          </div>

          {currentRole !== 'parent' && (
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Student:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.fullName} ({s.studentId} • Grade {s.grade}-{s.section})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {currentCard && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Published: {currentCard.publishedDate}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              GPA: {currentCard.gpa.toFixed(2)} / 4.0
            </span>
          </div>
        )}
      </div>

      {/* Scorecard Display */}
      {currentCard ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-bold text-lg border border-white/20">
                {currentStudent?.fullName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">{currentStudent?.fullName}</h3>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/20 text-white font-mono">
                    {currentCard.studentId}
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Grade {currentCard.grade} - Section {currentCard.section} • Academic Year {currentCard.academicYear}
                </p>
                <p className="text-xs font-semibold text-white/90 mt-1">
                  {currentCard.examName} ({currentCard.term})
                </p>
              </div>
            </div>

            {/* Performance badges */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-indigo-200 font-semibold uppercase block">Score Total</span>
                <span className="text-xl font-bold">{currentCard.totalMarksObtained} / {currentCard.totalMaxMarks}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs border border-white/20 px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-indigo-200 font-semibold uppercase block">Percentage</span>
                <span className="text-xl font-bold text-amber-300">{currentCard.percentage}%</span>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-400/30 px-4 py-2 rounded-xl text-center">
                <span className="text-[10px] text-emerald-200 font-semibold uppercase block">Grade / GPA</span>
                <span className="text-xl font-bold text-emerald-300">{currentCard.overallGrade} ({currentCard.gpa.toFixed(1)})</span>
              </div>
            </div>
          </div>

          {/* Subject Breakdown Table */}
          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Subject Performance Ledger</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Subject Course</th>
                      <th className="px-5 py-3">Maximum Marks</th>
                      <th className="px-5 py-3">Marks Obtained</th>
                      <th className="px-5 py-3">Percentage</th>
                      <th className="px-5 py-3">Letter Grade</th>
                      <th className="px-5 py-3">Teacher Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentCard.scores.map((sub, idx) => {
                      const p = Math.round((sub.marksObtained / sub.totalMarks) * 100);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3.5 font-bold text-slate-900">{sub.subject}</td>
                          <td className="px-5 py-3.5 text-slate-500 font-mono">{sub.totalMarks}</td>
                          <td className="px-5 py-3.5 font-mono font-bold text-indigo-600">{sub.marksObtained}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    p >= 80 ? 'bg-emerald-500' : p >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${p}%` }}
                                />
                              </div>
                              <span className="font-semibold text-slate-700 font-mono">{p}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                              {sub.grade}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 italic">{sub.remarks || 'Satisfactory'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Educator Remarks */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Class Teacher & Principal Remarks
                </span>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{currentCard.teacherRemarks}"
                </p>
                {currentCard.principalRemarks && (
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    Principal Note: "{currentCard.principalRemarks}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right text-[11px] text-slate-500">
                  <span className="block font-semibold text-slate-800">Verified & Sealed</span>
                  <span>Academic Dean Board</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-indigo-300 flex items-center justify-center text-indigo-600">
                  <FileCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Scorecard Registered</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {currentRole === 'parent'
              ? 'Results for this assessment series are currently pending publication by the school board.'
              : `No record found for ${currentStudent?.fullName} in ${selectedExamName}.`}
          </p>

          {currentRole !== 'parent' && (
            <button
              onClick={handleOpenEdit}
              className="mt-4 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Enter Exam Marks Now
            </button>
          )}
        </div>
      )}

      {/* Enter / Edit Marks Modal */}
      {isEditingMarks && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Enter Exam Marks & Academic Assessment</h3>
                <p className="text-xs text-slate-500">
                  Student: <strong>{currentStudent?.fullName}</strong> ({currentStudent?.studentId})
                </p>
              </div>
              <button onClick={() => setIsEditingMarks(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveScorecard} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assessment Term</label>
                  <select
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Quarter 1">Quarter 1</option>
                    <option value="Mid Term">Mid Term</option>
                    <option value="Quarter 3">Quarter 3</option>
                    <option value="Final Term">Final Term</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Exam Title</label>
                  <input
                    type="text"
                    disabled
                    value={selectedExamName}
                    className="w-full px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-slate-700 font-semibold">Subject Marks</label>
                {editableScores.map((sub, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="col-span-5 font-bold text-slate-800">{sub.subject}</div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        min={0}
                        max={sub.totalMarks}
                        value={sub.marksObtained}
                        onChange={(e) => {
                          const updated = [...editableScores];
                          updated[idx].marksObtained = Number(e.target.value);
                          setEditableScores(updated);
                        }}
                        className="w-full px-2 py-1 rounded border border-slate-200 text-center font-bold"
                      />
                    </div>
                    <div className="col-span-2 text-slate-400 font-mono text-center">/ {sub.totalMarks}</div>
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Remark"
                        value={sub.remarks || ''}
                        onChange={(e) => {
                          const updated = [...editableScores];
                          updated[idx].remarks = e.target.value;
                          setEditableScores(updated);
                        }}
                        className="w-full px-1.5 py-1 rounded border border-slate-200 text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Class Teacher Remarks</label>
                <textarea
                  rows={2}
                  required
                  value={teacherRemarks}
                  onChange={(e) => setTeacherRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Principal Seal Comment</label>
                <input
                  type="text"
                  value={principalRemarks}
                  onChange={(e) => setPrincipalRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingMarks(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Publish Report Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Academic Transcript Modal */}
      {isPrintPreviewOpen && currentCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Official Transcript Document
              </span>
              <button onClick={() => setIsPrintPreviewOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* School Letterhead */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                OAKRIDGE ACADEMY HIGH SCHOOL
              </h1>
              <p className="text-xs text-slate-500">Board of Secondary & Higher Education • Accreditation #8492</p>
              <h2 className="text-sm font-bold text-indigo-900 mt-2 uppercase tracking-wide">
                OFFICIAL STATEMENT OF ACADEMIC ACHIEVEMENT
              </h2>
            </div>

            {/* Student metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">Student Full Name:</span>
                <span className="font-bold text-slate-900 text-sm">{currentStudent?.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Registration / Student ID:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{currentCard.studentId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Grade & Section:</span>
                <span className="font-bold text-slate-900">Grade {currentCard.grade} - Section {currentCard.section}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Examination Term:</span>
                <span className="font-bold text-slate-900">{currentCard.examName} ({currentCard.term})</span>
              </div>
            </div>

            {/* Marks table */}
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-bold text-slate-800 border-b">
                <tr>
                  <th className="p-2.5">Subject</th>
                  <th className="p-2.5 text-center">Max Marks</th>
                  <th className="p-2.5 text-center">Marks Awarded</th>
                  <th className="p-2.5 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentCard.scores.map((s, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-medium">{s.subject}</td>
                    <td className="p-2.5 text-center font-mono">{s.totalMarks}</td>
                    <td className="p-2.5 text-center font-mono font-bold">{s.marksObtained}</td>
                    <td className="p-2.5 text-center font-bold">{s.grade}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                  <td className="p-2.5">Aggregate Summary</td>
                  <td className="p-2.5 text-center font-mono">{currentCard.totalMaxMarks}</td>
                  <td className="p-2.5 text-center font-mono text-indigo-700">{currentCard.totalMarksObtained}</td>
                  <td className="p-2.5 text-center text-emerald-700">{currentCard.overallGrade} ({currentCard.percentage}%)</td>
                </tr>
              </tbody>
            </table>

            {/* Certification Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div>
                <div className="w-32 border-b border-slate-400 mb-1" />
                <span className="text-[11px] text-slate-500">Class Teacher Signature</span>
              </div>
              <div className="text-center">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] uppercase border border-emerald-300">
                  Result: Passed With Honors
                </span>
              </div>
              <div className="text-right">
                <div className="w-32 border-b border-slate-400 mb-1 ml-auto" />
                <span className="text-[11px] text-slate-500">Principal Seal & Date</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                <Download className="w-4 h-4" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
