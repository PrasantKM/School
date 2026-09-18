import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Student,
  Teacher,
  StudentAttendanceRecord,
  TeacherAttendanceRecord,
  LeaveRequest,
  Homework,
  HomeworkSubmission,
  Message,
  Announcement,
  ExamScorecard,
  FeeInvoice,
  SubjectScore,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_STUDENT_ATTENDANCE,
  INITIAL_TEACHER_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_HOMEWORKS,
  INITIAL_MESSAGES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_SCORECARDS,
  INITIAL_FEE_INVOICES,
} from '../data/initialData';

export type NavigationTab =
  | 'dashboard'
  | 'students'
  | 'student-attendance'
  | 'teacher-attendance'
  | 'homework'
  | 'messaging'
  | 'scorecards'
  | 'fees'
  | 'announcements';

interface SchoolContextType {
  // Role & User
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  deviceMode: 'desktop' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;

  // Selected entities
  activeTeacher: Teacher;
  activeStudent: Student;
  setActiveStudentId: (studentId: string) => void;

  // Data
  students: Student[];
  teachers: Teacher[];
  studentAttendance: StudentAttendanceRecord[];
  teacherAttendance: TeacherAttendanceRecord[];
  leaveRequests: LeaveRequest[];
  homeworks: Homework[];
  messages: Message[];
  announcements: Announcement[];
  scorecards: ExamScorecard[];
  feeInvoices: FeeInvoice[];

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'studentId'>) => Student;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Student Attendance Actions
  markStudentAttendance: (record: Omit<StudentAttendanceRecord, 'id'>) => void;
  bulkMarkAttendance: (records: Omit<StudentAttendanceRecord, 'id'>[]) => void;

  // Teacher Attendance Actions
  clockInTeacher: (teacherId: string) => void;
  clockOutTeacher: (teacherId: string) => void;
  applyLeaveRequest: (leave: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => void;
  updateLeaveStatus: (leaveId: string, status: 'Approved' | 'Rejected') => void;

  // Homework Actions
  createHomework: (homework: Omit<Homework, 'id' | 'submissions'>) => void;
  submitHomework: (homeworkId: string, submission: Omit<HomeworkSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  gradeHomeworkSubmission: (homeworkId: string, submissionId: string, score: number, feedback: string) => void;

  // Messaging Actions
  sendMessage: (recipientId: string, recipientName: string, recipientRole: Role, content: string, subject?: string) => void;
  markMessageRead: (messageId: string) => void;

  // Announcement Actions
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Scorecard Actions
  saveOrUpdateScorecard: (scorecard: Omit<ExamScorecard, 'id' | 'totalMarksObtained' | 'totalMaxMarks' | 'percentage' | 'gpa' | 'overallGrade'>) => void;

  // Fee Actions
  payFeeInvoice: (invoiceId: string, paymentMethod: 'Credit Card' | 'Net Banking' | 'UPI' | 'Bank Transfer') => void;
  createFeeInvoice: (invoice: Omit<FeeInvoice, 'id' | 'invoiceNo' | 'issueDate' | 'amountPaid' | 'status'>) => void;

  // Helper Stats
  unreadMessageCount: number;
  pendingHomeworkCount: number;
  resetToDefaultData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'sms_app_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>(() => loadFromStorage('role', 'admin'));
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', INITIAL_STUDENTS));
  const [teachers] = useState<Teacher[]>(() => loadFromStorage('teachers', INITIAL_TEACHERS));
  const [activeStudentId, setActiveStudentIdState] = useState<string>(() => loadFromStorage('activeStudentId', 's1'));
  
  const [studentAttendance, setStudentAttendance] = useState<StudentAttendanceRecord[]>(() =>
    loadFromStorage('studentAttendance', INITIAL_STUDENT_ATTENDANCE)
  );
  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendanceRecord[]>(() =>
    loadFromStorage('teacherAttendance', INITIAL_TEACHER_ATTENDANCE)
  );
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() =>
    loadFromStorage('leaveRequests', INITIAL_LEAVE_REQUESTS)
  );
  const [homeworks, setHomeworks] = useState<Homework[]>(() =>
    loadFromStorage('homeworks', INITIAL_HOMEWORKS)
  );
  const [messages, setMessages] = useState<Message[]>(() =>
    loadFromStorage('messages', INITIAL_MESSAGES)
  );
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadFromStorage('announcements', INITIAL_ANNOUNCEMENTS)
  );
  const [scorecards, setScorecards] = useState<ExamScorecard[]>(() =>
    loadFromStorage('scorecards', INITIAL_SCORECARDS)
  );
  const [feeInvoices, setFeeInvoices] = useState<FeeInvoice[]>(() =>
    loadFromStorage('feeInvoices', INITIAL_FEE_INVOICES)
  );

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'role', JSON.stringify(currentRole));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'students', JSON.stringify(students));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'activeStudentId', JSON.stringify(activeStudentId));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'studentAttendance', JSON.stringify(studentAttendance));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'teacherAttendance', JSON.stringify(teacherAttendance));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'leaveRequests', JSON.stringify(leaveRequests));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'homeworks', JSON.stringify(homeworks));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'messages', JSON.stringify(messages));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'announcements', JSON.stringify(announcements));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'scorecards', JSON.stringify(scorecards));
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'feeInvoices', JSON.stringify(feeInvoices));
    } catch (e) {
      console.warn('Storage sync failed:', e);
    }
  }, [
    currentRole,
    students,
    activeStudentId,
    studentAttendance,
    teacherAttendance,
    leaveRequests,
    homeworks,
    messages,
    announcements,
    scorecards,
    feeInvoices,
  ]);

  const activeTeacher = teachers[0]; // Mrs. Eleanor Vance by default
  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0] || INITIAL_STUDENTS[0];

  const setActiveStudentId = (id: string) => {
    setActiveStudentIdState(id);
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'studentId'>): Student => {
    const nextNum = students.length + 1;
    const generatedId = `STU-2026-${String(nextNum).padStart(3, '0')}`;
    const newStudent: Student = {
      ...studentData,
      id: `s-${Date.now()}`,
      studentId: generatedId,
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Attendance
  const markStudentAttendance = (record: Omit<StudentAttendanceRecord, 'id'>) => {
    setStudentAttendance((prev) => {
      // replace if already exists for same student & date
      const filtered = prev.filter((r) => !(r.studentId === record.studentId && r.date === record.date));
      return [{ ...record, id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` }, ...filtered];
    });
  };

  const bulkMarkAttendance = (records: Omit<StudentAttendanceRecord, 'id'>[]) => {
    setStudentAttendance((prev) => {
      let current = [...prev];
      records.forEach((rec) => {
        current = current.filter((r) => !(r.studentId === rec.studentId && r.date === rec.date));
        current.unshift({ ...rec, id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` });
      });
      return current;
    });
  };

  // Teacher Attendance
  const clockInTeacher = (teacherId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTeacherAttendance((prev) => {
      const existing = prev.find((t) => t.teacherId === teacherId && t.date === today);
      if (existing) {
        return prev.map((t) => (t.id === existing.id ? { ...t, clockInTime: timeStr, status: 'Present' } : t));
      }
      return [
        {
          id: `ta-${Date.now()}`,
          teacherId,
          date: today,
          clockInTime: timeStr,
          status: 'Present',
          workingHours: 0,
        },
        ...prev,
      ];
    });
  };

  const clockOutTeacher = (teacherId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTeacherAttendance((prev) =>
      prev.map((t) => {
        if (t.teacherId === teacherId && t.date === today) {
          return {
            ...t,
            clockOutTime: timeStr,
            workingHours: 8.0,
          };
        }
        return t;
      })
    );
  };

  const applyLeaveRequest = (leave: Omit<LeaveRequest, 'id' | 'appliedAt' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...leave,
      id: `lr-${Date.now()}`,
      status: 'Pending',
      appliedAt: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
  };

  const updateLeaveStatus = (leaveId: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests((prev) => prev.map((l) => (l.id === leaveId ? { ...l, status } : l)));
  };

  // Homework
  const createHomework = (homework: Omit<Homework, 'id' | 'submissions'>) => {
    const newHw: Homework = {
      ...homework,
      id: `hw-${Date.now()}`,
      submissions: [],
    };
    setHomeworks((prev) => [newHw, ...prev]);
  };

  const submitHomework = (
    homeworkId: string,
    submission: Omit<HomeworkSubmission, 'id' | 'submittedAt' | 'status'>
  ) => {
    const timeStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newSubmission: HomeworkSubmission = {
      ...submission,
      id: `sub-${Date.now()}`,
      submittedAt: timeStr,
      status: 'Submitted',
    };

    setHomeworks((prev) =>
      prev.map((hw) => {
        if (hw.id === homeworkId) {
          const filtered = hw.submissions.filter((s) => s.studentId !== submission.studentId);
          return {
            ...hw,
            submissions: [...filtered, newSubmission],
          };
        }
        return hw;
      })
    );
  };

  const gradeHomeworkSubmission = (
    homeworkId: string,
    submissionId: string,
    score: number,
    feedback: string
  ) => {
    setHomeworks((prev) =>
      prev.map((hw) => {
        if (hw.id === homeworkId) {
          return {
            ...hw,
            submissions: hw.submissions.map((sub) => {
              if (sub.id === submissionId) {
                return {
                  ...sub,
                  status: 'Graded',
                  score,
                  teacherFeedback: feedback,
                };
              }
              return sub;
            }),
          };
        }
        return hw;
      })
    );
  };

  // Messaging
  const sendMessage = (
    recipientId: string,
    recipientName: string,
    recipientRole: Role,
    content: string,
    subject?: string
  ) => {
    let senderId = 'admin';
    let senderName = 'School Administration';
    if (currentRole === 'teacher') {
      senderId = activeTeacher.teacherId;
      senderName = activeTeacher.fullName;
    } else if (currentRole === 'parent') {
      senderId = `${activeStudent.studentId}-P`;
      senderName = `${activeStudent.guardianName} (${activeStudent.fullName}'s Parent)`;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString();

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      senderRole: currentRole,
      recipientId,
      recipientName,
      recipientRole,
      subject: subject || 'Notice & Update',
      content,
      timestamp: `${dateStr} ${timeStr}`,
      isRead: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
  };

  const markMessageRead = (messageId: string) => {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m)));
  };

  // Announcements
  const createAnnouncement = (announcement: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Scorecards
  const calculateGradeMetrics = (scores: SubjectScore[]) => {
    const totalMarksObtained = scores.reduce((sum, s) => sum + s.marksObtained, 0);
    const totalMaxMarks = scores.reduce((sum, s) => sum + s.totalMarks, 0);
    const percentage = totalMaxMarks > 0 ? Number(((totalMarksObtained / totalMaxMarks) * 100).toFixed(1)) : 0;

    // GPA on 4.0 scale
    let gpa = 0;
    if (percentage >= 90) gpa = 4.0;
    else if (percentage >= 80) gpa = 3.5;
    else if (percentage >= 70) gpa = 3.0;
    else if (percentage >= 60) gpa = 2.5;
    else if (percentage >= 50) gpa = 2.0;
    else gpa = 1.0;

    let overallGrade = 'A+';
    if (percentage >= 90) overallGrade = 'A+';
    else if (percentage >= 80) overallGrade = 'A';
    else if (percentage >= 70) overallGrade = 'B+';
    else if (percentage >= 60) overallGrade = 'B';
    else if (percentage >= 50) overallGrade = 'C';
    else overallGrade = 'F';

    return { totalMarksObtained, totalMaxMarks, percentage, gpa, overallGrade };
  };

  const saveOrUpdateScorecard = (
    data: Omit<ExamScorecard, 'id' | 'totalMarksObtained' | 'totalMaxMarks' | 'percentage' | 'gpa' | 'overallGrade'>
  ) => {
    const metrics = calculateGradeMetrics(data.scores);
    const newScorecard: ExamScorecard = {
      ...data,
      ...metrics,
      id: `sc-${Date.now()}`,
    };

    setScorecards((prev) => {
      // check if exists for same student & exam
      const filtered = prev.filter((s) => !(s.studentId === data.studentId && s.examName === data.examName));
      return [newScorecard, ...filtered];
    });
  };

  // Fees
  const payFeeInvoice = (
    invoiceId: string,
    paymentMethod: 'Credit Card' | 'Net Banking' | 'UPI' | 'Bank Transfer'
  ) => {
    const timeStr = new Date().toISOString().split('T')[0];
    const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setFeeInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'Paid',
            amountPaid: inv.totalAmount,
            paidAt: timeStr,
            paymentMethod,
            receiptNo,
          };
        }
        return inv;
      })
    );
  };

  const createFeeInvoice = (
    invoice: Omit<FeeInvoice, 'id' | 'invoiceNo' | 'issueDate' | 'amountPaid' | 'status'>
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newInv: FeeInvoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: today,
      amountPaid: 0,
      status: 'Pending',
    };
    setFeeInvoices((prev) => [newInv, ...prev]);
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setStudentAttendance(INITIAL_STUDENT_ATTENDANCE);
    setTeacherAttendance(INITIAL_TEACHER_ATTENDANCE);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setHomeworks(INITIAL_HOMEWORKS);
    setMessages(INITIAL_MESSAGES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setScorecards(INITIAL_SCORECARDS);
    setFeeInvoices(INITIAL_FEE_INVOICES);
  };

  // Helper metrics
  const unreadMessageCount = messages.filter((m) => {
    if (currentRole === 'parent') {
      return !m.isRead && (m.recipientRole === 'parent' || m.recipientId.includes(activeStudent.studentId));
    }
    if (currentRole === 'teacher') {
      return !m.isRead && (m.recipientRole === 'teacher' || m.recipientId === activeTeacher.teacherId);
    }
    return !m.isRead;
  }).length;

  const pendingHomeworkCount = homeworks.filter((hw) => {
    if (currentRole === 'parent') {
      const sub = hw.submissions.find((s) => s.studentId === activeStudent.studentId);
      return !sub;
    }
    // For teacher: submissions awaiting grading
    return hw.submissions.some((s) => s.status === 'Submitted');
  }).length;

  return (
    <SchoolContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        deviceMode,
        setDeviceMode,
        activeTeacher,
        activeStudent,
        setActiveStudentId,
        students,
        teachers,
        studentAttendance,
        teacherAttendance,
        leaveRequests,
        homeworks,
        messages,
        announcements,
        scorecards,
        feeInvoices,
        addStudent,
        updateStudent,
        deleteStudent,
        markStudentAttendance,
        bulkMarkAttendance,
        clockInTeacher,
        clockOutTeacher,
        applyLeaveRequest,
        updateLeaveStatus,
        createHomework,
        submitHomework,
        gradeHomeworkSubmission,
        sendMessage,
        markMessageRead,
        createAnnouncement,
        deleteAnnouncement,
        saveOrUpdateScorecard,
        payFeeInvoice,
        createFeeInvoice,
        unreadMessageCount,
        pendingHomeworkCount,
        resetToDefaultData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
