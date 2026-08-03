import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import {
  FiSend,
  FiX,
  FiSmile,
  FiCornerUpLeft,
  FiBookmark,
  FiTrash2,
  FiImage,
} from 'react-icons/fi';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🔥', '👏', '🚀', '🎉', '💡'];

const ChatPanel = ({ roomId, initialMessages = [], onClose, isOwner }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserTyping = ({ username, socketId }) => {
      if (socketId !== socket.id) {
        setTypingUsers((prev) => new Set(prev).add(username));
      }
    };

    const handleUserStopTyping = ({ socketId }) => {
      setTypingUsers((prev) => {
        const copy = new Set(prev);
        // Clean up
        return copy;
      });
    };

    const handleMessagePinned = ({ messageId, pinned }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, pinned } : m))
      );
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on('new-message', handleNewMessage);
    socket.on('user-typing', handleUserTyping);
    socket.on('user-stop-typing', handleUserStopTyping);
    socket.on('message-pinned-updated', handleMessagePinned);
    socket.on('message-deleted-socket', handleMessageDeleted);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('user-typing', handleUserTyping);
      socket.off('user-stop-typing', handleUserStopTyping);
      socket.off('message-pinned-updated', handleMessagePinned);
      socket.off('message-deleted-socket', handleMessageDeleted);
    };
  }, [socket]);

  const handleInputChange = (e) => {
    setText(e.target.value);
    if (socket && roomId) {
      socket.emit('typing', { roomId });
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;

    socket.emit('send-message', {
      roomId,
      content: text,
      replyTo: replyTo ? replyTo._id : null,
    });

    setText('');
    setReplyTo(null);
    setShowEmojis(false);
    socket.emit('stop-typing', { roomId });
  };

  const addEmoji = (emoji) => {
    setText((prev) => prev + emoji);
  };

  const handlePin = (messageId) => {
    if (socket) {
      socket.emit('pin-message', { roomId, messageId });
    }
  };

  const handleDelete = (messageId) => {
    if (socket) {
      socket.emit('delete-message', { roomId, messageId });
    }
  };

  const pinnedMessage = messages.find((m) => m.pinned);

  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleSendImage = (e) => {
    e.preventDefault();
    if (!imageUrl.trim() || !socket) return;

    socket.emit('send-message', {
      roomId,
      content: imageUrl.trim(),
      type: 'image',
      fileUrl: imageUrl.trim(),
      replyTo: replyTo ? replyTo._id : null,
    });

    setImageUrl('');
    setShowImageInput(false);
    setReplyTo(null);
  };

  const isImage = (msg) => {
    if (msg.type === 'image' || msg.fileUrl) return true;
    const c = msg.content || '';
    return c.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) || c.startsWith('http') && (c.includes('images') || c.includes('photo') || c.includes('dicebear'));
  };

  return (
    <div className="w-full md:w-80 h-full bg-slate-900/90 border-l border-slate-800 flex flex-col justify-between z-40 backdrop-blur-xl">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Live Chat</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      {/* Pinned Message Banner */}
      {pinnedMessage && (
        <div className="px-4 py-2 bg-indigo-950/60 border-b border-indigo-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 truncate">
            <FiBookmark className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span className="text-indigo-200 truncate">
              <strong className="text-white">{pinnedMessage.sender?.username}: </strong>
              {pinnedMessage.content}
            </span>
          </div>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((m) => {
            const isMe = m.sender?._id === user?._id || m.sender === user?._id;
            const hasImage = isImage(m);
            return (
              <div key={m._id || Math.random()} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
                <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-slate-400">
                  <span>{m.sender?.username || 'User'}</span>
                  <span>•</span>
                  <span>{new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`relative max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800/90 text-slate-200 rounded-bl-none border border-slate-700/50'
                  }`}
                >
                  {/* Reply Reference */}
                  {m.replyTo && (
                    <div className="p-1.5 mb-2 rounded-lg bg-black/20 text-[10px] opacity-80 border-l-2 border-indigo-400">
                      Replying to previous message
                    </div>
                  )}

                  {hasImage ? (
                    <div>
                      <img
                        src={m.fileUrl || m.content}
                        alt="Shared media"
                        className="max-w-full rounded-xl object-cover max-h-48 shadow-md border border-slate-700/50"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      {m.content && !m.content.startsWith('http') && <p className="mt-1">{m.content}</p>}
                    </div>
                  ) : (
                    <p>{m.content}</p>
                  )}

                  {/* Message Action Overlay */}
                  <div className="absolute -top-3 right-0 hidden group-hover:flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-full px-2 py-0.5 shadow-md">
                    <button
                      onClick={() => setReplyTo(m)}
                      className="text-slate-400 hover:text-white p-1"
                      title="Reply"
                    >
                      <FiCornerUpLeft className="w-3 h-3" />
                    </button>
                    {(isOwner || isMe) && (
                      <>
                        <button
                          onClick={() => handlePin(m._id)}
                          className="text-slate-400 hover:text-amber-400 p-1"
                          title="Pin"
                        >
                          <FiBookmark className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                          title="Delete"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Status */}
      {typingUsers.size > 0 && (
        <div className="px-4 py-1 text-[11px] text-indigo-400 italic animate-pulse">
          Someone is typing...
        </div>
      )}

      {/* Image URL Modal Drawer */}
      {showImageInput && (
        <form onSubmit={handleSendImage} className="p-3 bg-slate-800/90 border-t border-slate-700 flex items-center space-x-2">
          <input
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL (e.g. https://...)"
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Send Image
          </button>
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            <FiX className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Reply Banner */}
      {replyTo && (
        <div className="px-4 py-2 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
          <span className="truncate">Replying to {replyTo.sender?.username}</span>
          <button onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-white">
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Emojis Drawer */}
      {showEmojis && (
        <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 flex items-center space-x-2 overflow-x-auto">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              className="text-lg hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
          title="Emojis"
        >
          <FiSmile className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className="p-2 text-slate-400 hover:text-indigo-400 transition-colors"
          title="Share Image URL"
        >
          <FiImage className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all cursor-pointer"
        >
          <FiSend className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
