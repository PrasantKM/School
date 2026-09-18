import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Message, Announcement, Role } from '../../types';
import {
  MessageSquare,
  Send,
  Bell,
  Plus,
  Search,
  Check,
  CheckCheck,
  Pin,
  Trash2,
  X,
  User,
  AlertCircle,
  Tag,
  Share2,
} from 'lucide-react';

export const MessagingCenter: React.FC = () => {
  const {
    messages,
    announcements,
    sendMessage,
    markMessageRead,
    createAnnouncement,
    deleteAnnouncement,
    currentRole,
    activeTeacher,
    activeStudent,
    teachers,
    students,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'direct' | 'announcements'>('direct');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('TCH-2026-01');
  const [replyText, setReplyText] = useState('');

  // Modals
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [isNewAnnModalOpen, setIsNewAnnModalOpen] = useState(false);

  // New message state
  const [composeRecipientId, setComposeRecipientId] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');

  // New announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<Announcement['category']>('General');
  const [annAudience, setAnnAudience] = useState<Announcement['targetAudience']>('All');

  // Derive dialogue contacts for current role
  const getContacts = () => {
    if (currentRole === 'parent') {
      // Parents talk to teachers
      return teachers.map((t) => ({
        id: t.teacherId,
        name: t.fullName,
        role: 'teacher' as Role,
        subtitle: `${t.subject} Faculty`,
      }));
    } else if (currentRole === 'teacher') {
      // Teachers talk to parents of their students
      return students.map((s) => ({
        id: `${s.studentId}-P`,
        name: `${s.guardianName} (${s.fullName}'s Parent)`,
        role: 'parent' as Role,
        subtitle: `Grade ${s.grade}-${s.section} • Roll ${s.rollNo}`,
      }));
    } else {
      // Admin can talk to both
      return [
        ...teachers.map((t) => ({
          id: t.teacherId,
          name: t.fullName,
          role: 'teacher' as Role,
          subtitle: `Faculty - ${t.subject}`,
        })),
        ...students.map((s) => ({
          id: `${s.studentId}-P`,
          name: `${s.guardianName} (${s.fullName}'s Parent)`,
          role: 'parent' as Role,
          subtitle: `Parent of ${s.fullName}`,
        })),
      ];
    }
  };

  const contacts = getContacts();

  // Active contact details
  const activeContact = contacts.find((c) => c.id === selectedRecipientId) || contacts[0];

  // Messages in this thread
  const threadMessages = messages.filter(
    (m) =>
      (m.recipientId === activeContact?.id || m.senderId === activeContact?.id) ||
      (currentRole === 'parent' && m.recipientId.includes(activeStudent.studentId))
  );

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeContact) return;

    sendMessage(activeContact.id, activeContact.name, activeContact.role, replyText);
    setReplyText('');
  };

  const handleSendCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeContent.trim() || !composeRecipientId) return;

    const contact = contacts.find((c) => c.id === composeRecipientId);
    if (!contact) return;

    sendMessage(contact.id, contact.name, contact.role, composeContent, composeSubject);
    setSelectedRecipientId(contact.id);
    setIsComposeModalOpen(false);
    setComposeSubject('');
    setComposeContent('');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    createAnnouncement({
      title: annTitle,
      content: annContent,
      category: annCategory,
      targetAudience: annAudience,
      postedBy:
        currentRole === 'teacher'
          ? `${activeTeacher.fullName} (${activeTeacher.subject})`
          : 'Central Administration',
      isPinned: false,
    });

    setIsNewAnnModalOpen(false);
    setAnnTitle('');
    setAnnContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Communication & Notifications Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Direct dialogue between educators and parents, and school-wide administrative announcements
          </p>
        </div>

        {/* Tab switch & Compose */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'direct' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Direct Messages
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'announcements' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Announcements ({announcements.length})
            </button>
          </div>

          {activeTab === 'direct' ? (
            <button
              onClick={() => setIsComposeModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              New Message
            </button>
          ) : (
            currentRole !== 'parent' && (
              <button
                onClick={() => setIsNewAnnModalOpen(true)}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                Post Notice
              </button>
            )
          )}
        </div>
      </div>

      {activeTab === 'direct' ? (
        /* Split Pane Direct Messenger */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row h-[620px]">
          
          {/* Contacts Sidebar */}
          <div className="w-full md:w-72 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
            <div className="p-3 border-b border-slate-200 bg-white">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Active Conversations
              </span>
              <p className="text-[11px] text-slate-400">
                {currentRole === 'parent' ? 'Faculty Teachers' : 'Parent Contacts'}
              </p>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
              {contacts.map((contact) => {
                const isSelected = contact.id === activeContact?.id;
                const contactMsgs = messages.filter(
                  (m) => m.senderId === contact.id || m.recipientId === contact.id
                );
                const lastMsg = contactMsgs[0];

                return (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedRecipientId(contact.id)}
                    className={`w-full p-3.5 text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900 text-xs truncate">{contact.name}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{contact.subtitle}</p>
                      {lastMsg && (
                        <p className="text-[11px] text-slate-400 truncate mt-1 italic">
                          "{lastMsg.content}"
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Conversation Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Thread Header */}
            {activeContact && (
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {activeContact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{activeContact.name}</h3>
                    <p className="text-[11px] text-slate-500">{activeContact.subtitle}</p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Online • Campus Hub
                </span>
              </div>
            )}

            {/* Message Thread Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
              {threadMessages.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs">
                  No messages yet. Send a note to begin the communication thread.
                </div>
              ) : (
                threadMessages.map((msg) => {
                  const isOutgoing =
                    (currentRole === 'teacher' && msg.senderRole === 'teacher') ||
                    (currentRole === 'parent' && msg.senderRole === 'parent') ||
                    (currentRole === 'admin' && msg.senderRole === 'admin');

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-1 px-1 font-medium">
                        {msg.senderName} • {msg.timestamp}
                      </span>
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isOutgoing
                            ? 'bg-indigo-600 text-white rounded-br-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {msg.subject && (
                          <div className={`font-bold mb-1 pb-1 border-b text-[11px] ${
                            isOutgoing ? 'border-white/20 text-indigo-100' : 'border-slate-100 text-slate-900'
                          }`}>
                            {msg.subject}
                          </div>
                        )}
                        <p>{msg.content}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                        <CheckCheck className="w-3 h-3 text-indigo-500" />
                        <span>Delivered</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Reply Form */}
            <form onSubmit={handleSendReply} className="p-3 border-t border-slate-200 bg-white flex gap-2">
              <input
                type="text"
                placeholder={`Type a message to ${activeContact?.name}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl shadow-xs transition-colors shrink-0"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* School Announcements Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border shadow-xs transition-all ${
                ann.isPinned
                  ? 'bg-gradient-to-br from-indigo-50/50 to-white border-indigo-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ann.category === 'Academic'
                        ? 'bg-blue-100 text-blue-800'
                        : ann.category === 'Sports'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ann.category === 'Holiday'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {ann.category}
                  </span>
                  {ann.isPinned && (
                    <span className="flex items-center gap-1 text-[10px] text-indigo-700 font-semibold">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{ann.date}</span>
                  {currentRole === 'admin' && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">{ann.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{ann.content}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Posted by: <strong>{ann.postedBy}</strong></span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  Audience: {ann.targetAudience}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compose Message Modal */}
      {isComposeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">New Dialogue Message</h3>
              <button onClick={() => setIsComposeModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCompose} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Recipient *</label>
                <select
                  required
                  value={composeRecipientId}
                  onChange={(e) => setComposeRecipientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Choose recipient...</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.subtitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Academic Progress Update"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your note here..."
                  value={composeContent}
                  onChange={(e) => setComposeContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsComposeModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Send Direct Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Announcement Modal */}
      {isNewAnnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Broadcast School Announcement</h3>
              <button onClick={() => setIsNewAnnModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Sports Meet Schedule"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                  <select
                    value={annAudience}
                    onChange={(e) => setAnnAudience(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All">All School</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Teachers">Teachers Only</option>
                    <option value="Students">Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Complete announcement text..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewAnnModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
