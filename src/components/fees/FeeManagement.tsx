import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeeInvoice, FeeItem } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Receipt,
  Download,
  DollarSign,
  Filter,
  Check,
  X,
  ShieldCheck,
  FileText,
} from 'lucide-react';

export const FeeManagement: React.FC = () => {
  const {
    feeInvoices,
    students,
    createFeeInvoice,
    payFeeInvoice,
    currentRole,
    activeStudent,
  } = useSchool();

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<FeeInvoice | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<FeeInvoice | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');

  // New Invoice Form
  const [newInvoiceData, setNewInvoiceData] = useState({
    studentId: students[0]?.studentId || '',
    itemDesc: 'Tuition & Academic Program Fee',
    amount: 1200,
    term: 'Term 1 (Fall 2026)',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Net Banking' | 'UPI' | 'Bank Transfer'>('Credit Card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  // Filter invoices for current role
  const relevantInvoices = feeInvoices.filter((inv) => {
    if (currentRole === 'parent') {
      return inv.studentId === activeStudent.studentId;
    }
    return true;
  });

  const filteredInvoices = relevantInvoices.filter((inv) => {
    if (statusFilter === 'All') return true;
    return inv.status === statusFilter;
  });

  // Financial aggregates
  const totalBilled = relevantInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = relevantInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalPending = totalBilled - totalCollected;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.studentId === newInvoiceData.studentId);
    if (!student) return;

    createFeeInvoice({
      studentId: student.studentId,
      studentName: student.fullName,
      grade: student.grade,
      section: student.section,
      term: newInvoiceData.term,
      dueDate: newInvoiceData.dueDate,
      items: [
        {
          description: newInvoiceData.itemDesc,
          amount: Number(newInvoiceData.amount),
        },
      ],
      totalAmount: Number(newInvoiceData.amount),
    });

    setIsInvoiceModalOpen(false);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    payFeeInvoice(payingInvoice.id, paymentMethod);

    // After payment, open receipt modal
    const updatedReceipt: FeeInvoice = {
      ...payingInvoice,
      status: 'Paid',
      amountPaid: payingInvoice.totalAmount,
      paidAt: new Date().toISOString().split('T')[0],
      paymentMethod,
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setPayingInvoice(null);
    setViewingReceipt(updatedReceipt);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tuition & School Fee Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentRole === 'parent'
              ? `Fee schedule, dues breakdown, and secure payment portal for ${activeStudent.fullName}`
              : 'Invoice generation, revenue tracking, and parent ledger reconciliation'}
          </p>
        </div>

        {currentRole === 'admin' && (
          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Issue Student Fee Invoice
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Billed Volume</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">${totalBilled.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Academic Year 2025-2026</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-600">Settled / Collected</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">${totalCollected.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-600/80 mt-0.5 block">
            {Math.round((totalCollected / (totalBilled || 1)) * 100)}% payment compliance
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-amber-600">Outstanding Dues</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">${totalPending.toLocaleString()}</p>
          <span className="text-[11px] text-amber-600/80 mt-0.5 block">
            {relevantInvoices.filter((i) => i.status !== 'Paid').length} unpaid invoice(s)
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Status Filter:</span>
          <div className="flex gap-1.5">
            {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-slate-400">
          Showing <strong>{filteredInvoices.length}</strong> invoice vouchers
        </span>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Line Items & Term</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Receipt / Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900">{inv.studentName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {inv.studentId} • Grade {inv.grade}-{inv.section}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800">
                      {inv.items.map((it) => it.description).join(', ')}
                    </div>
                    <div className="text-[11px] text-slate-500">{inv.term}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-900 text-sm">
                    ${inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-600">{inv.dueDate}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {inv.status === 'Paid' ? (
                      <button
                        onClick={() => setViewingReceipt(inv)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2.5 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        View Receipt
                      </button>
                    ) : (
                      <button
                        onClick={() => setPayingInvoice(inv)}
                        className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online Pay Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Online Tuition Fee Payment</h3>
                  <p className="text-xs text-slate-500 font-mono">Invoice #{payingInvoice.invoiceNo}</p>
                </div>
              </div>
              <button onClick={() => setPayingInvoice(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bill Info */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">{payingInvoice.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Items:</span>
                <span className="font-medium text-slate-800">
                  {payingInvoice.items.map((i) => i.description).join(', ')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
                <span className="text-slate-900">Total Payable:</span>
                <span className="text-emerald-700 font-mono">${payingInvoice.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Credit Card', 'Net Banking', 'UPI', 'Bank Transfer'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2 rounded-lg border text-center font-semibold text-[11px] transition-all ${
                        paymentMethod === method
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'Credit Card' && (
                <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white rounded border border-slate-200 font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Expires</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3 py-1.5 bg-white rounded border border-slate-200 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">CVV</label>
                      <input
                        type="password"
                        defaultValue="894"
                        className="w-full px-3 py-1.5 bg-white rounded border border-slate-200 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>256-Bit Encrypted Secure School Payment Gateway</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Authorize Payment (${payingInvoice.totalAmount})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Payment Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Official School Fee Receipt
              </span>
              <button onClick={() => setViewingReceipt(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1 border-b pb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Payment Successfully Settled</h3>
              <p className="text-xs text-slate-500 font-mono">
                Receipt #{viewingReceipt.receiptNo || 'REC-2026-8921'}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student</span>
                <span className="font-bold text-slate-900">
                  {viewingReceipt.studentName} ({viewingReceipt.studentId})
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Class & Section</span>
                <span className="text-slate-800">Grade {viewingReceipt.grade}-{viewingReceipt.section}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Academic Term</span>
                <span className="text-slate-800">{viewingReceipt.term}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Settled On</span>
                <span className="font-mono text-slate-800">
                  {viewingReceipt.paidAt || new Date().toISOString().split('T')[0]}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Mode</span>
                <span className="font-medium text-slate-800">
                  {viewingReceipt.paymentMethod || 'Credit Card'}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold">
                <span className="text-slate-900">Amount Settled</span>
                <span className="text-emerald-700 font-mono">
                  ${viewingReceipt.totalAmount.toLocaleString()}.00 USD
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                <Download className="w-4 h-4" />
                Print Tax Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin New Fee Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Issue Student Fee Voucher</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Student *</label>
                <select
                  required
                  value={newInvoiceData.studentId}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {students.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.fullName} ({s.studentId} • Grade {s.grade}-{s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Fee Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab & Computing Levy"
                  value={newInvoiceData.itemDesc}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, itemDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Term</label>
                  <select
                    value={newInvoiceData.term}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, term: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Term 1 (Fall 2026)">Term 1 (Fall 2026)</option>
                    <option value="Term 2 (Spring 2026)">Term 2 (Spring 2026)</option>
                    <option value="Annual Levy">Annual Levy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newInvoiceData.amount}
                    onChange={(e) => setNewInvoiceData({ ...newInvoiceData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Due Date *</label>
                <input
                  type="date"
                  required
                  value={newInvoiceData.dueDate}
                  onChange={(e) => setNewInvoiceData({ ...newInvoiceData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Generate Invoice Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
