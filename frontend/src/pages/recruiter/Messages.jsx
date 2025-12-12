import React, { useState } from 'react';

const RecruiterMessages = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      candidateId: 1,
      candidateName: 'Nguyễn Văn An',
      candidateAvatar: null,
      jobTitle: 'Frontend Developer',
      lastMessage: 'Cảm ơn anh đã liên hệ, em rất quan tâm đến vị trí này.',
      lastMessageTime: '2024-01-16T14:30:00',
      unreadCount: 2,
      isActive: true,
      status: 'online' // online, offline, away
    },
    {
      id: 2,
      candidateId: 2,
      candidateName: 'Trần Thị Lan',
      candidateAvatar: null,
      jobTitle: 'Backend Developer',
      lastMessage: 'Em có thể bắt đầu làm việc từ ngày 20/1/2024.',
      lastMessageTime: '2024-01-15T16:45:00',
      unreadCount: 0,
      isActive: false,
      status: 'offline'
    },
    {
      id: 3,
      candidateId: 3,
      candidateName: 'Lê Văn Minh',
      candidateAvatar: null,
      jobTitle: 'Full Stack Developer',
      lastMessage: 'Anh có thể cho em biết thêm về quy trình phỏng vấn không?',
      lastMessageTime: '2024-01-14T10:20:00',
      unreadCount: 1,
      isActive: false,
      status: 'away'
    },
    {
      id: 4,
      candidateId: 4,
      candidateName: 'Phạm Thị Hương',
      candidateAvatar: null,
      jobTitle: 'UI/UX Designer',
      lastMessage: 'Em đã gửi portfolio qua email, anh vui lòng kiểm tra.',
      lastMessageTime: '2024-01-13T09:15:00',
      unreadCount: 0,
      isActive: false,
      status: 'offline'
    },
    {
      id: 5,
      candidateId: 5,
      candidateName: 'Hoàng Văn Đức',
      candidateAvatar: null,
      jobTitle: 'DevOps Engineer',
      lastMessage: 'Em xác nhận sẽ tham gia buổi phỏng vấn vào 10h sáng mai.',
      lastMessageTime: '2024-01-12T18:00:00',
      unreadCount: 0,
      isActive: false,
      status: 'online'
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      conversationId: 1,
      senderId: 'recruiter', // recruiter or candidate
      senderName: 'Recruiter',
      content: 'Chào bạn! Tôi đã xem hồ sơ của bạn và rất ấn tượng. Bạn có thể cho tôi biết thêm về kinh nghiệm làm việc với React không?',
      timestamp: '2024-01-16T10:00:00',
      type: 'text', // text, file, image
      status: 'read' // sent, delivered, read
    },
    {
      id: 2,
      conversationId: 1,
      senderId: 'candidate',
      senderName: 'Nguyễn Văn An',
      content: 'Chào anh! Em có 3 năm kinh nghiệm với React. Em đã làm việc với các project từ nhỏ đến lớn, sử dụng Redux, React Router và các thư viện khác.',
      timestamp: '2024-01-16T10:15:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 3,
      conversationId: 1,
      senderId: 'recruiter',
      senderName: 'Recruiter',
      content: 'Tuyệt vời! Chúng tôi đang tìm kiếm một Frontend Developer có kinh nghiệm như bạn. Bạn có muốn tham gia một buổi phỏng vấn không?',
      timestamp: '2024-01-16T10:30:00',
      type: 'text',
      status: 'read'
    },
    {
      id: 4,
      conversationId: 1,
      senderId: 'candidate',
      senderName: 'Nguyễn Văn An',
      content: 'Cảm ơn anh đã liên hệ, em rất quan tâm đến vị trí này.',
      timestamp: '2024-01-16T14:30:00',
      type: 'text',
      status: 'delivered'
    }
  ]);

  const [activeConversation, setActiveConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, active

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) {
      return `${Math.floor(diff / (1000 * 60))} phút trước`;
    } else if (hours < 24) {
      return `${Math.floor(hours)} giờ trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') {
      return matchesSearch && conv.unreadCount > 0;
    } else if (filter === 'active') {
      return matchesSearch && conv.isActive;
    }
    
    return matchesSearch;
  });

  const activeMessages = messages.filter(msg => msg.conversationId === activeConversation);
  const activeConv = conversations.find(conv => conv.id === activeConversation);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      conversationId: activeConversation,
      senderId: 'recruiter',
      senderName: 'Recruiter',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sent'
    };

    setMessages([...messages, message]);
    
    // Update last message in conversation
    setConversations(conversations.map(conv => 
      conv.id === activeConversation 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
        : conv
    ));
    
    setNewMessage('');
  };

  const markAsRead = (conversationId) => {
    setConversations(conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  const quickReplies = [
    'Cảm ơn bạn đã quan tâm!',
    'Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.',
    'Bạn có thể cung cấp thêm thông tin về kinh nghiệm không?',
    'Chúng tôi muốn mời bạn tham gia phỏng vấn.',
    'Bạn có thể bắt đầu làm việc khi nào?'
  ];

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">Tin nhắn</h1>
            <div className="flex items-center space-x-2">
              {totalUnread > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {totalUnread}
                </span>
              )}
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'all' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'unread' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Chưa đọc
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Đang hoạt động
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => {
                setActiveConversation(conversation.id);
                markAsRead(conversation.id);
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                activeConversation === conversation.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {conversation.candidateAvatar ? (
                      <img src={conversation.candidateAvatar} alt={conversation.candidateName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-xl text-gray-400">👤</span>
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(conversation.status)}`}></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.candidateName}</h3>
                    <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                  </div>
                  <p className="text-xs text-green-600 mb-1">{conversation.jobTitle}</p>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-1">
                      {conversation.isActive && (
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredConversations.length === 0 && (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 text-sm">Không tìm thấy cuộc trò chuyện nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {activeConv.candidateAvatar ? (
                        <img src={activeConv.candidateAvatar} alt={activeConv.candidateName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-lg text-gray-400">👤</span>
                      )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(activeConv.status)}`}></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{activeConv.candidateName}</h2>
                    <p className="text-sm text-green-600">{activeConv.jobTitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'recruiter' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === 'recruiter'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-between mt-1 ${
                      message.senderId === 'recruiter' ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{formatMessageTime(message.timestamp)}</span>
                      {message.senderId === 'recruiter' && (
                        <div className="ml-2">
                          {message.status === 'sent' && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {message.status === 'delivered' && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {message.status === 'read' && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="bg-gray-50 px-4 py-2">
              <div className="flex space-x-2 overflow-x-auto">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => setNewMessage(reply)}
                    className="flex-shrink-0 px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                >
                  Gửi
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chọn một cuộc trò chuyện</h3>
              <p className="text-gray-500">Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterMessages;
