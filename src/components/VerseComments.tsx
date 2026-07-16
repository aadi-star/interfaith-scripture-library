import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Lock, 
  Globe, 
  Trash2, 
  Edit2, 
  Send, 
  CornerDownRight, 
  User, 
  X, 
  Check, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Clock
} from "lucide-react";
import { User as FirebaseUser } from "firebase/auth";
import { 
  addComment, 
  getCommentsForVerse, 
  deleteCommentFromFirestore, 
  updateCommentInFirestore, 
  FirestoreComment 
} from "../firebase";

interface VerseCommentsProps {
  verseRef: string;
  verseNumber: number | string;
  currentUser: FirebaseUser | null;
  onLogin: () => void;
}

export const VerseComments: React.FC<VerseCommentsProps> = ({
  verseRef,
  verseNumber,
  currentUser,
  onLogin,
}) => {
  const [comments, setComments] = useState<FirestoreComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [content, setContent] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Live action/overlay states
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [submittingReply, setSubmittingReply] = useState<boolean>(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editIsPrivate, setEditIsPrivate] = useState<boolean>(false);
  const [submittingEdit, setSubmittingEdit] = useState<boolean>(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Load comments
  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getCommentsForVerse(verseRef);
      setComments(list);
    } catch (err: any) {
      console.error("Error loading comments:", err);
      setError("Failed to sync portion discussions. Try reloading.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // Reset inputs on verseRef change
    setContent("");
    setReplyToId(null);
    setEditingId(null);
    setConfirmDeleteId(null);
  }, [verseRef]);

  // Tree representation computed in memory
  const { topLevelComments, repliesMap } = useMemo(() => {
    const topLevel = comments.filter((c) => !c.parentId);
    const replies: Record<string, FirestoreComment[]> = {};
    
    comments.forEach((c) => {
      if (c.parentId) {
        if (!replies[c.parentId]) {
          replies[c.parentId] = [];
        }
        replies[c.parentId].push(c);
      }
    });

    return { topLevelComments: topLevel, repliesMap: replies };
  }, [comments]);

  // Submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!content.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await addComment(verseRef, content.trim(), isPrivate);
      setContent("");
      await loadComments();
    } catch (err: any) {
      setError("Failed to publish comment. Over-limit or unauthorized.");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit threaded reply
  const handleSubmitReply = async (parentId: string) => {
    if (!currentUser) return;
    if (!replyContent.trim()) return;

    setSubmittingReply(true);
    setError(null);
    try {
      // Find parent privacy mode
      const parentComment = comments.find(c => c.id === parentId);
      const isReplyPrivate = parentComment ? parentComment.isPrivate : false;

      await addComment(verseRef, replyContent.trim(), isReplyPrivate, parentId);
      setReplyContent("");
      setReplyToId(null);
      await loadComments();
    } catch (err: any) {
      setError("Failed to publish reply thread.");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Submit edit
  const handleSaveEdit = async (commentId: string) => {
    if (!currentUser) return;
    if (!editContent.trim()) return;

    setSubmittingEdit(true);
    setError(null);
    try {
      await updateCommentInFirestore(commentId, editContent.trim(), editIsPrivate);
      setEditingId(null);
      await loadComments();
    } catch (err: any) {
      setError("Failed to update discussion comment.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    setError(null);
    try {
      await deleteCommentFromFirestore(commentId);
      setConfirmDeleteId(null);
      await loadComments();
    } catch (err: any) {
      setError("Failed to clear comment.");
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-rose-500 to-red-600",
      "from-amber-500 to-orange-600",
      "from-emerald-500 to-teal-600",
      "from-blue-500 to-indigo-600",
      "from-purple-500 to-fuchsia-600",
      "from-cyan-500 to-sky-600"
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return "Just now";
    
    // ServerTimestamp placeholder
    if (ts.seconds === undefined && ts.toMillis === undefined) {
      return "Publishing...";
    }

    let date: Date;
    if (ts.toMillis) {
      date = new Date(ts.toMillis());
    } else if (ts.seconds) {
      date = new Date(ts.seconds * 1000);
    } else {
      date = new Date(ts);
    }

    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 10) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div 
      id={`verse-comments-container-${verseNumber}`}
      className="mt-4 p-4 border border-cyan-500/15 bg-cyan-950/[0.04] rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()} // Stop bubbling
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h5 className="text-[11px] uppercase font-mono tracking-wider text-cyan-400 flex items-center space-x-1.5 font-bold">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <span>Interactive Verse Discussions & Spiritual Log</span>
        </h5>
        
        <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
          <span>Ref: {verseRef}</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* COMMENTS LIST */}
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
        {loading && comments.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center justify-center space-y-2 text-slate-500 text-xs font-mono">
            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Synchronizing Portion Threads...</span>
          </div>
        ) : topLevelComments.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs font-serif italic border border-dashed border-white/5 rounded-xl">
            No active discussions on this verse. Be the first to reflect!
          </div>
        ) : (
          <div className="space-y-4">
            {topLevelComments.map((comment) => {
              const replies = repliesMap[comment.id!] || [];
              const isOwner = currentUser?.uid === comment.userId;
              const isEditing = editingId === comment.id;
              const isConfirmingDelete = confirmDeleteId === comment.id;

              return (
                <div 
                  key={comment.id} 
                  className="space-y-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                >
                  {/* COMMENT HEADER */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      {comment.userPhoto ? (
                        <img 
                          src={comment.userPhoto} 
                          alt={comment.userName} 
                          className="w-6 h-6 rounded-full border border-white/10 flex-shrink-0 object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className={`w-6 h-6 rounded-full bg-gradient-to-tr ${getAvatarColor(comment.userName)} flex items-center justify-center text-[10px] text-white font-bold uppercase`}>
                          {comment.userName.charAt(0)}
                        </span>
                      )}
                      
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-200 leading-tight">
                          {comment.userName}
                        </span>
                        <span className="text-[9px] text-slate-500 flex items-center space-x-1 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{formatTimestamp(comment.createdAt)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {comment.isPrivate ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[8px] font-mono flex items-center space-x-0.5" title="Private to your personal spiritual journal">
                          <Lock className="w-2 h-2" />
                          <span>Personal Log</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[8px] font-mono flex items-center space-x-0.5" title="Publicly viewable to all members">
                          <Globe className="w-2 h-2" />
                          <span>Public Thread</span>
                        </span>
                      )}

                      {/* EDIT/DELETE ACTIONS */}
                      {isOwner && !isEditing && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              setEditingId(comment.id!);
                              setEditContent(comment.content);
                              setEditIsPrivate(comment.isPrivate);
                            }}
                            className="p-1 text-slate-500 hover:text-cyan-400 rounded hover:bg-white/5 transition-all"
                            title="Edit comment"
                          >
                            <Edit2 className="w-2.5 h-2.5" />
                          </button>
                          
                          <button
                            onClick={() => setConfirmDeleteId(comment.id!)}
                            className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-white/5 transition-all"
                            title="Delete comment"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EDIT MODE FORM */}
                  {isEditing ? (
                    <div className="space-y-2 mt-1">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#0d0d12] border border-cyan-500/30 rounded-lg text-slate-200 outline-none focus:border-cyan-500 h-16 resize-none"
                      />
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-1.5 text-[10px] text-slate-400 cursor-pointer font-mono select-none">
                          <input 
                            type="checkbox" 
                            checked={editIsPrivate} 
                            onChange={(e) => setEditIsPrivate(e.target.checked)}
                            className="rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-0 mr-1"
                          />
                          <span>Keep Log Private</span>
                        </label>
                        
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 rounded text-[10px] bg-white/5 hover:bg-white/10 text-slate-400 cursor-pointer font-mono uppercase"
                          >
                            Cancel
                          </button>
                          <button
                            disabled={submittingEdit || !editContent.trim()}
                            onClick={() => handleSaveEdit(comment.id!)}
                            className="px-2.5 py-1 rounded text-[10px] bg-cyan-600 hover:bg-cyan-500 text-black font-semibold disabled:opacity-50 cursor-pointer font-mono uppercase flex items-center space-x-1"
                          >
                            {submittingEdit && <div className="w-2.5 h-2.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>}
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* RENDERED TEXT */
                    <p className="text-xs text-slate-300 leading-relaxed pl-1 whitespace-pre-line font-serif">
                      {comment.content}
                    </p>
                  )}

                  {/* INLINE DELETE CONFIRMATION */}
                  {isConfirmingDelete && (
                    <div className="p-2 bg-red-950/20 border border-red-500/25 rounded-lg flex items-center justify-between text-[10px] text-red-300 font-mono">
                      <span>Are you absolutely sure you want to delete this comment? This cannot be undone.</span>
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <button 
                          onClick={() => setConfirmDeleteId(null)} 
                          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id!)} 
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {/* REPLY LINK HEADER */}
                  {currentUser && !isEditing && !isConfirmingDelete && (
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          setReplyToId(replyToId === comment.id ? null : comment.id!);
                          setReplyContent("");
                        }}
                        className="text-[9px] uppercase font-mono tracking-wider text-slate-400 hover:text-cyan-400 flex items-center space-x-1.5 transition-all outline-none"
                      >
                        <CornerDownRight className="w-3 h-3 text-cyan-500" />
                        <span>{replyToId === comment.id ? "Cancel Reply" : `Reply to thread (${replies.length})`}</span>
                      </button>
                    </div>
                  )}

                  {/* INLINE THREADED REPLY FORM */}
                  {replyToId === comment.id && currentUser && (
                    <div className="pl-4 border-l border-cyan-500/20 space-y-2 mt-2">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Write custom reply to ${comment.userName}...`}
                        className="w-full text-xs p-2 bg-[#09090d] border border-white/10 rounded-lg text-slate-200 outline-none focus:border-cyan-500/40 h-14 resize-none"
                        maxLength={2000}
                      />
                      <div className="flex justify-between items-center text-[9px] text-slate-500">
                        <span className="font-mono">
                          {comment.isPrivate ? "🔒 Reply inherits Private visibility" : "🌐 Reply inherits Public visibility"}
                        </span>
                        <button
                          disabled={submittingReply || !replyContent.trim()}
                          onClick={() => handleSubmitReply(comment.id!)}
                          className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold rounded disabled:opacity-50 font-mono text-[9px] cursor-pointer uppercase flex items-center space-x-1"
                        >
                          {submittingReply && <div className="w-2 h-2 border-2 border-black border-t-transparent rounded-full animate-spin"></div>}
                          <span>Submit Reply</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* THREAD REPLIES (LEVEL 1 INDENTED) */}
                  {replies.length > 0 && (
                    <div className="pl-4 border-l border-white/5 space-y-3 pt-1">
                      {replies.map((reply) => {
                        const isReplyOwner = currentUser?.uid === reply.userId;
                        const isReplyEditing = editingId === reply.id;
                        const isReplyConfirmingDelete = confirmDeleteId === reply.id;

                        return (
                          <div key={reply.id} className="p-2.5 bg-white/[0.01] border border-white/[0.02] rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {reply.userPhoto ? (
                                  <img 
                                    src={reply.userPhoto} 
                                    alt={reply.userName} 
                                    className="w-5 h-5 rounded-full border border-white/5 flex-shrink-0 object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span className={`w-5 h-5 rounded-full bg-gradient-to-tr ${getAvatarColor(reply.userName)} flex items-center justify-center text-[9px] text-white font-bold uppercase`}>
                                    {reply.userName.charAt(0)}
                                  </span>
                                )}
                                <div className="flex flex-col">
                                  <span className="text-[11px] font-semibold text-slate-300 leading-none">{reply.userName}</span>
                                  <span className="text-[8px] text-slate-500 font-mono leading-none pt-0.5">{formatTimestamp(reply.createdAt)}</span>
                                </div>
                              </div>

                              {isReplyOwner && !isReplyEditing && (
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => {
                                      setEditingId(reply.id!);
                                      setEditContent(reply.content);
                                      setEditIsPrivate(reply.isPrivate);
                                    }}
                                    className="p-1 text-slate-500 hover:text-cyan-400 rounded hover:bg-white/5 transition-all"
                                    title="Edit reply"
                                  >
                                    <Edit2 className="w-2.5 h-2.5" />
                                  </button>
                                  
                                  <button
                                    onClick={() => setConfirmDeleteId(reply.id!)}
                                    className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-white/5 transition-all"
                                    title="Delete reply"
                                  >
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {isReplyEditing ? (
                              <div className="space-y-1.5 mt-1">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full text-xs p-2 bg-[#0d0d12] border border-cyan-500/30 rounded-lg text-slate-200 outline-none focus:border-cyan-500 h-14 resize-none"
                                />
                                <div className="flex justify-end space-x-1.5">
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="px-2 py-0.5 rounded text-[9px] bg-white/5 hover:bg-white/10 text-slate-400 cursor-pointer font-mono"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    disabled={submittingEdit || !editContent.trim()}
                                    onClick={() => handleSaveEdit(reply.id!)}
                                    className="px-2 py-0.5 rounded text-[9px] bg-cyan-600 hover:bg-cyan-500 text-black font-semibold disabled:opacity-50 cursor-pointer font-mono uppercase"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-300 font-serif leading-relaxed pl-1 whitespace-pre-line">
                                {reply.content}
                              </p>
                            )}

                            {isReplyConfirmingDelete && (
                              <div className="p-1.5 bg-red-950/20 border border-red-500/25 rounded flex items-center justify-between text-[9px] text-red-300 font-mono">
                                <span>Delete this reply?</span>
                                <div className="flex items-center space-x-1 flex-shrink-0">
                                  <button 
                                    onClick={() => setConfirmDeleteId(null)} 
                                    className="px-1.5 py-0.5 bg-white/5 rounded cursor-pointer"
                                  >
                                    No
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteComment(reply.id!)} 
                                    className="px-1.5 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded cursor-pointer"
                                  >
                                    Yes
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* NEW COMMENT/LOG INPUT BOX */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="border-t border-white/5 pt-3 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write deep insights, notes, or post a discussion thread here..."
            className="w-full text-xs p-3 bg-[#0d0d12] border border-slate-800 rounded-xl text-slate-200 outline-none focus:border-cyan-500/40 h-20 resize-none"
            maxLength={2000}
          />
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            {/* Toggle Private vs Public */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-1.5 text-xs text-slate-400 cursor-pointer font-mono select-none">
                <input 
                  type="radio" 
                  name={`privacy-${verseRef}`}
                  checked={!isPrivate} 
                  onChange={() => setIsPrivate(false)}
                  className="bg-slate-900 border-white/20 text-cyan-500 focus:ring-0 mr-1 cursor-pointer"
                />
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Public Team Discussion</span>
              </label>

              <label className="flex items-center space-x-1.5 text-xs text-slate-400 cursor-pointer font-mono select-none">
                <input 
                  type="radio" 
                  name={`privacy-${verseRef}`}
                  checked={isPrivate} 
                  onChange={() => setIsPrivate(true)}
                  className="bg-slate-900 border-white/20 text-cyan-500 focus:ring-0 mr-1 cursor-pointer"
                />
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Private Spiritual Log</span>
              </label>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <span className="text-[10px] text-slate-500 font-mono pr-1">
                {2000 - content.length} chars
              </span>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg disabled:opacity-50 text-xs cursor-pointer font-mono uppercase flex items-center space-x-1.5 shadow-md shadow-cyan-900/20 active:scale-95 transition-all"
              >
                {submitting ? (
                  <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Post Insight</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="border-t border-white/5 pt-4 p-4 text-center bg-cyan-950/[0.02] border border-cyan-500/10 rounded-xl space-y-3">
          <p className="text-xs text-slate-400 font-serif leading-relaxed">
            Authenticity and security are essential for our multifaith discussion layers. Log in with Google to post public threads or keep secure private logs.
          </p>
          <button
            onClick={onLogin}
            className="px-4 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-mono font-bold font-semibold uppercase flex items-center space-x-1.5 mx-auto cursor-pointer"
          >
            <User className="w-4 h-4 text-cyan-400" />
            <span>Sign in with Google</span>
          </button>
        </div>
      )}
    </div>
  );
};
