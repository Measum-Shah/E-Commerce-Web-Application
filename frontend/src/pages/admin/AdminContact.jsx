import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Eye,
  Trash2,
  X,
  CheckCircle,
  Clock,
  MessageCircle,
  Mail,
  Phone,
  Filter,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";

import {
  getAllContacts,
  getContactStats,
  updateContactStatus,
  addContactReply,
  deleteContact,
} from "../../api/contactApi";

import { useAuth } from "../../context/AuthContext";

const AdminContact = () => {
  const { token } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    read: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    replied: "bg-green-500/20 text-green-400 border border-green-500/30",
    spam: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  const statusIcons = {
    pending: <Clock size={12} />,
    read: <Eye size={12} />,
    replied: <CheckCircle size={12} />,
    spam: <X size={12} />,
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;

      const data = await getAllContacts(params, token);
      setContacts(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getContactStats(token);
      setStats(data.data);
    } catch (error) {
      console.error("Stats error:", error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, filterStatus, searchTerm]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateContactStatus(id, status, token);
      toast.success(`Status updated to ${status}`);
      if (selectedContact?._id === id) {
        setSelectedContact((prev) => ({ ...prev, status }));
      }
      fetchContacts();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleReply = async (id) => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }
    try {
      setSubmitting(true);
      const data = await addContactReply(id, replyMessage, token);
      toast.success("Reply saved successfully");
      setReplyMessage("");
      setSelectedContact(data.data);
      fetchContacts();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this contact query?")) return;
    try {
      await deleteContact(id, token);
      toast.success("Contact archived successfully");
      if (selectedContact?._id === id) setSelectedContact(null);
      fetchContacts();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to archive contact");
    }
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setReplyMessage("");
    if (contact.status === "pending") {
      handleStatusChange(contact._id, "read");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <section className="relative min-h-screen overflow-hidden bg-graphite-900 px-4 py-10 text-parchment-50 sm:px-6 lg:py-16">
      <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-velvet/30 blur-[120px]" />
      <div className="absolute bottom-[-120px] right-[-120px] h-72 w-72 rounded-full bg-velvet-light/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-graphite-700 bg-graphite-800 px-4 py-2 text-xs uppercase tracking-[0.2em] text-velvet-light">
            <Sparkles size={14} />
            Admin Dashboard
          </div>
          <h1 className="font-display text-5xl italic tracking-tight text-parchment-50 lg:text-6xl">
            Contact Queries
          </h1>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Total", value: stats.total, icon: <Mail size={18} />, color: "text-velvet-light" },
              { label: "Pending", value: stats.pending, icon: <Clock size={18} />, color: "text-yellow-400" },
              { label: "Read", value: stats.read, icon: <Eye size={18} />, color: "text-blue-400" },
              { label: "Replied", value: stats.replied, icon: <CheckCircle size={18} />, color: "text-green-400" },
              { label: "Today", value: stats.today, icon: <RefreshCw size={18} />, color: "text-velvet-light" },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="rounded-[1.25rem] border border-graphite-700 bg-graphite-800/80 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-parchment-100/60">{label}</p>
                  <span className={color}>{icon}</span>
                </div>
                <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-graphite-700 bg-graphite-800/80 px-4 py-2.5">
            <Filter size={15} className="text-parchment-100/50" />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-parchment-50 outline-none"
            >
              <option value="" className="bg-gray-900">All Status</option>
              <option value="pending" className="bg-gray-900">Pending</option>
              <option value="read" className="bg-gray-900">Read</option>
              <option value="replied" className="bg-gray-900">Replied</option>
              <option value="spam" className="bg-gray-900">Spam</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-64 rounded-xl border border-graphite-700 bg-graphite-800/80 px-4 py-2.5 text-sm text-parchment-50 outline-none placeholder:text-parchment-100/30 transition focus:border-velvet"
          />

          <button
            onClick={() => { setFilterStatus(""); setSearchTerm(""); setPage(1); }}
            className="rounded-xl border border-graphite-700 bg-graphite-800/80 px-4 py-2.5 text-sm text-parchment-100/70 transition hover:border-velvet hover:text-parchment-50"
          >
            Clear Filters
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-velvet border-t-transparent" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="rounded-[1.5rem] border border-graphite-700 bg-graphite-800/80 p-10 text-center text-parchment-100/50">
                No contact queries found.
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => handleViewDetails(contact)}
                    className={`cursor-pointer rounded-[1.25rem] border bg-graphite-800/80 p-5 backdrop-blur-xl transition hover:bg-graphite-800 ${
                      selectedContact?._id === contact._id
                        ? "border-velvet ring-1 ring-velvet/50"
                        : "border-graphite-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-parchment-50">{contact.fullName}</h3>
                          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${statusColors[contact.status]}`}>
                            {statusIcons[contact.status]}
                            {contact.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-parchment-100/60">{contact.email}</p>
                        <p className="mt-0.5 text-sm text-parchment-100/60">{contact.phone}</p>
                        <p className="mt-2 text-sm font-medium text-velvet-light">{contact.subject}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-parchment-100/70">{contact.message}</p>
                        <p className="mt-2 text-xs text-parchment-100/40">{formatDate(contact.createdAt)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(contact._id); }}
                        className="ml-3 shrink-0 rounded-xl p-2 text-red-400 transition hover:bg-red-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="rounded-xl border border-graphite-700 bg-graphite-800/80 px-4 py-2 text-sm text-parchment-100/70 transition hover:border-velvet disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-parchment-100/60">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="rounded-xl border border-graphite-700 bg-graphite-800/80 px-4 py-2 text-sm text-parchment-100/70 transition hover:border-velvet disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedContact ? (
              <div className="sticky top-6 rounded-[1.5rem] border border-graphite-700 bg-graphite-800/80 p-6 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-display text-xl italic text-parchment-50">Query Details</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="rounded-xl p-2 text-parchment-100/50 transition hover:bg-graphite-700 hover:text-parchment-50"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-parchment-100/40">Customer</p>
                    <p className="mt-1 font-medium text-parchment-50">{selectedContact.fullName}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-parchment-100/40">Contact</p>
                    <div className="mt-1 space-y-1">
                      <a href={`mailto:${selectedContact.email}`} className="flex items-center gap-2 text-velvet-light hover:underline">
                        <Mail size={13} />{selectedContact.email}
                      </a>
                      <a href={`tel:${selectedContact.phone}`} className="flex items-center gap-2 text-velvet-light hover:underline">
                        <Phone size={13} />{selectedContact.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-parchment-100/40">Subject</p>
                    <p className="mt-1 font-medium text-parchment-50">{selectedContact.subject}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-parchment-100/40">Message</p>
                    <p className="mt-1 leading-relaxed text-parchment-100/80">{selectedContact.message}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-parchment-100/40">Received</p>
                    <p className="mt-1 text-parchment-100/70">{formatDate(selectedContact.createdAt)}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-parchment-100/40">IP Address</p>
                    <p className="mt-1 font-mono text-xs text-parchment-100/60">{selectedContact.ipAddress || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-parchment-100/40">Status</p>
                    <select
                      value={selectedContact.status}
                      onChange={(e) => handleStatusChange(selectedContact._id, e.target.value)}
                      className="mt-1 rounded-xl border border-graphite-700 bg-graphite-900 px-3 py-2 text-sm text-parchment-50 outline-none transition focus:border-velvet"
                    >
                      <option value="pending">Pending</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="spam">Spam</option>
                    </select>
                  </div>

                  {selectedContact.replyMessage && (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3">
                      <p className="text-xs uppercase tracking-wider text-green-400">Previous Reply</p>
                      <p className="mt-1 text-parchment-100/80">{selectedContact.replyMessage}</p>
                      <p className="mt-1 text-xs text-parchment-100/40">{formatDate(selectedContact.repliedAt)}</p>
                    </div>
                  )}

                  <div className="border-t border-graphite-700 pt-4">
                    <label className="mb-2 block text-sm font-medium text-parchment-100">
                      {selectedContact.replyMessage ? "Update Reply" : "Reply to Customer"}
                    </label>
                    <div className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 transition focus-within:border-velvet">
                      <textarea
                        rows="4"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply here..."
                        className="w-full resize-none bg-transparent py-3 text-parchment-50 outline-none placeholder:text-parchment-100/30"
                      />
                    </div>
                    <button
                      onClick={() => handleReply(selectedContact._id)}
                      disabled={submitting}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-velvet px-4 py-3 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <><Send size={16} />{selectedContact.replyMessage ? "Update Reply" : "Send Reply"}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-graphite-700 bg-graphite-800/80 p-10 text-center backdrop-blur-xl">
                <MessageCircle size={40} className="mx-auto mb-3 text-parchment-100/20" />
                <p className="text-parchment-100/60">Select a query to view details</p>
                <p className="mt-1 text-sm text-parchment-100/40">and send a reply</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminContact;