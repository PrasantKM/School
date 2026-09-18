import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Homework, HomeworkSubmission } from '../../types';
import {
  BookOpen,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileText,
  X,
  Award,
  ChevronRight,
  Filter,
  Check,
  AlertCircle,
} from 'lucide-react';

export const HomeworkManagement: React.FC = () => {
  const {
    homeworks,
    createHomework,
    submitHomework,
    gradeHomeworkSubmission,
    currentRole,
    activeStudent,
    activeTeacher,
    students,
  } = useSchool();

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submittingHomework, setSubmittingHomework] = useState<Homework | null>(null);
  const [viewingSubmissionsHw, setViewingSubmissionsHw] = useState<Homework | null>(null);
  const [gradingSubmission, setGradingSubmission] = useState<{
    hwId: string;
    sub: HomeworkSubmission;
  } | null>(null);

  // Filters
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Submitted' | 'Graded'>('All');

  // Create Homework Form
  const [newHw, setNewHw] = useState({
    title: '',
    subject: 'Mathematics',
    grade: '10',
    section: 'A',
    description: '',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    maxMarks: 25,
    attachmentName: '',
  });

  // Student Online Submission Form
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionFileName, setSubmissionFileName] = useState('');

  // Grading Form
  const [gradeScore, setGradeScore] = useState<number>(20);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Handlers
  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHw.title.trim()) return;

    createHomework({
      title: newHw.title,
      subject: newHw.subject,
      grade: newHw.grade,
      section: newHw.section,
      teacherId: activeTeacher.teacherId,
      teacherName: activeTeacher.fullName,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: newHw.dueDate,
      description: newHw.description,
      maxMarks: Number(newHw.maxMarks),
      attachmentName: newHw.attachmentName || undefined,
    });

    setIsCreateModalOpen(false);
    setNewHw({
      title: '',
      subject: 'Mathematics',
      grade: '10',
      section: 'A',
      description: '',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxMarks: 25,
      attachmentName: '',
    });
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingHomework) return;

    submitHomework(submittingHomework.id, {
      homeworkId: submittingHomework.id,
      studentId: activeStudent.studentId,
      studentName: activeStudent.fullName,
      content: submissionContent || 'Submitted assignment solutions.',
      attachmentName: submissionFileName || `${activeStudent.fullName.replace(/\s+/g, '')}_Submission.pdf`,
      maxScore: submittingHomework.maxMarks,
    });

    setSubmittingHomework(null);
    setSubmissionContent('');
    setSubmissionFileName('');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    gradeHomeworkSubmission(
      gradingSubmission.hwId,
      gradingSubmission.sub.id,
      Number(gradeScore),
      gradeFeedback
    );

    setGradingSubmission(null);
    setGradeFeedback('');
  };

  // Filter homeworks based on role
  const relevantHomeworks = homeworks.filter((hw) => {
    if (currentRole === 'parent') {
      return hw.grade === activeStudent.grade;
    }
    return true;
  });

  const filteredHomeworks = relevantHomeworks.filter((hw) => {
    const matchesSubject = subjectFilter === 'All' || hw.subject === subjectFilter;
    if (!matchesSubject) return false;

    if (currentRole === 'parent') {
      const sub = hw.submissions.find((s) => s.studentId === activeStudent.studentId);
      if (statusFilter === 'Pending') return !sub;
      if (statusFilter === 'Submitted') return sub?.status === 'Submitted';
      if (statusFilter === 'Graded') return sub?.status === 'Graded';
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Homework & Assignment Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentRole === 'parent'
              ? `Curriculum assignments and digital submissions for ${activeStudent.fullName}`
              : 'Create coursework, manage deadlines, and evaluate student online submissions'}
          </p>
        </div>

        {currentRole !== 'parent' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Assign New Homework
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none"
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics & General Science">Physics & Science</option>
              <option value="English Literature">English Literature</option>
              <option value="Social Studies & History">Social Studies</option>
            </select>
          </div>

          {currentRole === 'parent' && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending Submission</option>
                <option value="Submitted">Submitted (Waiting Grade)</option>
                <option value="Graded">Evaluated & Graded</option>
              </select>
            </div>
          )}
        </div>

        <span className="text-slate-400">
          Showing <strong>{filteredHomeworks.length}</strong> assignments
        </span>
      </div>

      {/* Homework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredHomeworks.map((hw) => {
          const childSubmission = hw.submissions.find(
            (s) => s.studentId === activeStudent.studentId
          );
          const isPending = !childSubmission;
          const isGraded = childSubmission?.status === 'Graded';

          return (
            <div
              key={hw.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between p-5 space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {hw.subject}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Grade {hw.grade}-{hw.section}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">{hw.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{hw.description}</p>

                {hw.attachmentName && (
                  <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate font-medium">{hw.attachmentName}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due: <strong>{hw.dueDate}</strong></span>
                  </div>
                  <span className="font-semibold text-slate-700">Max: {hw.maxMarks} pts</span>
                </div>

                {/* Role-specific Actions */}
                {currentRole === 'parent' ? (
                  <div>
                    {isGraded ? (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                        <div className="flex items-center justify-between font-bold text-emerald-800">
                          <span>Grade Score:</span>
                          <span>{childSubmission.score} / {hw.maxMarks}</span>
                        </div>
                        {childSubmission.teacherFeedback && (
                          <p className="text-[11px] text-emerald-700 mt-1 italic">
                            "{childSubmission.teacherFeedback}"
                          </p>
                        )}
                      </div>
                    ) : childSubmission?.status === 'Submitted' ? (
                      <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Submitted
                        </span>
                        <span className="text-[10px] text-blue-600">{childSubmission.submittedAt}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSubmittingHomework(hw)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Submit Assignment Online
                      </button>
                    )}
                  </div>
                ) : (
                  /* Teacher / Admin Action */
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      <strong>{hw.submissions.length}</strong> submitted
                    </span>
                    <button
                      onClick={() => setViewingSubmissionsHw(hw)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      Review Submissions <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Homework Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Assign New Course Homework</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4: Polynomial Factorization"
                  value={newHw.title}
                  onChange={(e) => setNewHw({ ...newHw, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                  <select
                    value={newHw.subject}
                    onChange={(e) => setNewHw({ ...newHw, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics & General Science">Physics & General Science</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Social Studies & History">Social Studies & History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Class</label>
                  <div className="flex gap-2">
                    <select
                      value={newHw.grade}
                      onChange={(e) => setNewHw({ ...newHw, grade: e.target.value })}
                      className="w-1/2 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="10">Grade 10</option>
                      <option value="9">Grade 9</option>
                      <option value="8">Grade 8</option>
                    </select>
                    <select
                      value={newHw.section}
                      onChange={(e) => setNewHw({ ...newHw, section: e.target.value })}
                      className="w-1/2 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="A">Sec A</option>
                      <option value="B">Sec B</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Submission Deadline *</label>
                  <input
                    type="date"
                    required
                    value={newHw.dueDate}
                    onChange={(e) => setNewHw({ ...newHw, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Score (Marks)</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={newHw.maxMarks}
                    onChange={(e) => setNewHw({ ...newHw, maxMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Instructions & Problem Set Details *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline questions, references, or instructions for students..."
                  value={newHw.description}
                  onChange={(e) => setNewHw({ ...newHw, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Attachment File Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Worksheet_Chapter4_Quadratic.pdf"
                  value={newHw.attachmentName}
                  onChange={(e) => setNewHw({ ...newHw, attachmentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Online Submission Modal */}
      {submittingHomework && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Submit Assignment Online</h3>
                <p className="text-xs text-slate-500">{submittingHomework.title}</p>
              </div>
              <button onClick={() => setSubmittingHomework(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Student / Submitter</label>
                <input
                  type="text"
                  disabled
                  value={`${activeStudent.fullName} (${activeStudent.studentId})`}
                  className="w-full px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Submission Notes / Summary</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize your work or solutions steps..."
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Upload Work / File Attachment</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50">
                  <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <p className="font-medium text-slate-700 text-xs">Click or drag solution file here</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, DOCX, JPG, PNG (Max 25MB)</p>
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSubmissionFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block mt-2 px-3 py-1 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-700 cursor-pointer shadow-2xs hover:bg-slate-50"
                  >
                    Select File
                  </label>
                  {submissionFileName && (
                    <div className="mt-2 text-[11px] font-semibold text-emerald-600 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Attached: {submissionFileName}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmittingHomework(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Turn In Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Submissions Review Modal */}
      {viewingSubmissionsHw && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Student Submissions Roster</h3>
                <p className="text-xs text-slate-500">{viewingSubmissionsHw.title} (Max Marks: {viewingSubmissionsHw.maxMarks})</p>
              </div>
              <button onClick={() => setViewingSubmissionsHw(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewingSubmissionsHw.submissions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No students have submitted this homework yet.
              </div>
            ) : (
              <div className="space-y-3">
                {viewingSubmissionsHw.submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sub.studentName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">({sub.studentId})</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === 'Graded'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 italic">"{sub.content}"</p>
                      {sub.attachmentName && (
                        <p className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> File: {sub.attachmentName}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-1">Submitted at {sub.submittedAt}</p>
                    </div>

                    <div className="shrink-0 text-right space-y-1">
                      {sub.status === 'Graded' ? (
                        <div>
                          <span className="text-sm font-bold text-emerald-700">
                            Score: {sub.score} / {sub.maxScore}
                          </span>
                          {sub.teacherFeedback && (
                            <p className="text-[11px] text-slate-500 max-w-[200px] truncate">
                              Feedback: {sub.teacherFeedback}
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setGradingSubmission({ hwId: viewingSubmissionsHw.id, sub });
                              setGradeScore(sub.score || 20);
                              setGradeFeedback(sub.teacherFeedback || '');
                            }}
                            className="text-[11px] text-indigo-600 hover:underline block font-semibold"
                          >
                            Edit Score
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setGradingSubmission({ hwId: viewingSubmissionsHw.id, sub });
                            setGradeScore(sub.maxScore);
                            setGradeFeedback('Good effort and clear solution steps.');
                          }}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs shadow-xs"
                        >
                          Evaluate & Grade
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grading Dialog */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Score & Feedback for {gradingSubmission.sub.studentName}
              </h3>
              <button onClick={() => setGradingSubmission(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Marks Obtained (out of {gradingSubmission.sub.maxScore})
                </label>
                <input
                  type="number"
                  min={0}
                  max={gradingSubmission.sub.maxScore}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teacher Remarks & Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback for student development..."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
