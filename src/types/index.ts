export type Role = 'admin' | 'teacher' | 'parent';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  studentId: string; // e.g. STU-2026-001
  fullName: string;
  rollNo: string;
  grade: string; // e.g. '10'
  section: string; // e.g. 'A'
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: string;
  admissionDate: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianEmail: string;
  address: string;
  emergencyContact: string;
  avatarUrl?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface Teacher {
  id: string;
  teacherId: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  assignedClasses: string[]; // e.g. ['10-A', '9-B']
  designation: string;
  joinDate: string;
  avatarUrl?: string;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface StudentAttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  grade: string;
  section: string;
  status: AttendanceStatus;
  remarks?: string;
  markedBy: string; // teacher name
}

export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  date: string;
  clockInTime?: string;
  clockOutTime?: string;
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent';
  workingHours?: number;
  leaveReason?: string;
}

export interface LeaveRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Maternity/Paternity' | 'Professional Development';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  attachmentName?: string;
  status: 'Submitted' | 'Graded' | 'Late';
  score?: number;
  maxScore: number;
  teacherFeedback?: string;
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  grade: string;
  section: string;
  teacherId: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  maxMarks: number;
  attachmentName?: string;
  submissions: HomeworkSubmission[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  recipientId: string;
  recipientName: string;
  recipientRole: Role;
  subject?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Sports' | 'Urgent' | 'Holiday';
  postedBy: string;
  targetAudience: 'All' | 'Teachers' | 'Parents' | 'Students';
  date: string;
  isPinned?: boolean;
}

export interface SubjectScore {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks?: string;
}

export interface ExamScorecard {
  id: string;
  studentId: string;
  examName: string; // e.g. 'Mid-Term Examination 2026'
  academicYear: string;
  grade: string;
  section: string;
  term: 'Quarter 1' | 'Mid Term' | 'Quarter 3' | 'Final Term';
  scores: SubjectScore[];
  totalMarksObtained: number;
  totalMaxMarks: number;
  percentage: number;
  gpa: number;
  overallGrade: string;
  rank?: number;
  attendancePercentage: number;
  teacherRemarks: string;
  principalRemarks: string;
  publishedDate: string;
}

export interface FeeItem {
  description: string;
  amount: number;
}

export interface FeeInvoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  term: string; // e.g. 'Term 1 (Fall 2026)'
  dueDate: string;
  issueDate: string;
  items: FeeItem[];
  totalAmount: number;
  amountPaid: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidAt?: string;
  paymentMethod?: 'Credit Card' | 'Net Banking' | 'UPI' | 'Bank Transfer';
  receiptNo?: string;
}
