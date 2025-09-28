import React, { useState, useRef, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import ReactMarkdown from 'react-markdown';
import { generateRoadmapContent, clearConversationHistory } from './services/geminiModel';
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useUser();
  const [selectedMode, setSelectedMode] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showHRInterview, setShowHRInterview] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const userData = {
    name: user?.fullName || "John Doe",
    department: "Computer Science",
    year: "3rd Year",
    avgScore: 78,
    interviewsAttempted: 5,
    progressPercentage: 65
  };

  const interviewModes = [
    { id: 'hr', title: 'HR Interview', icon: '👤', description: 'Practice behavioral and situational questions with AI interviewer' },
    { id: 'technical', title: 'Technical Interview', icon: '💻', description: 'Code challenges and system design' },
    { id: 'mixed', title: 'Mixed Mode', icon: '💬', description: 'Combination of HR and technical questions' }
  ];

  const performanceData = [
    { type: 'Technical', score: 65, improvement: 'Improve answers about OOP', trend: 'up' },
    { type: 'HR', score: 82, improvement: 'Practice STAR method responses', trend: 'up' },
    { type: 'Mixed', score: 73, improvement: 'Work on time management', trend: 'down' }
  ];

  // Helper functions (keeping the existing ones)
  const ensureDate = (timestamp) => {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      return new Date(timestamp);
    }
    return new Date();
  };

  const formatMessages = (messages) => {
    return messages.map(message => ({
      ...message,
      timestamp: ensureDate(message.timestamp)
    }));
  };

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('nextstep_chat_history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const formattedHistory = parsedHistory.map(chat => ({
          ...chat,
          timestamp: ensureDate(chat.timestamp),
          lastUpdated: ensureDate(chat.lastUpdated),
          messages: formatMessages(chat.messages)
        }));
        setChatHistory(formattedHistory);
      } catch (error) {
        console.error('Error parsing chat history:', error);
        localStorage.removeItem('nextstep_chat_history');
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('nextstep_chat_history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Initialize chatbot with greeting message
  useEffect(() => {
    if (showChatbot && messages.length === 0 && !currentChatId) {
      setMessages([{
        type: 'bot',
        content: "👋 **Welcome to Roadmap Generator!**\n\nI'm your AI-powered learning assistant. I create personalized, week-by-week roadmaps with YouTube resources, practical exercises, and real projects.\n\n**🚀 What I Can Help You With:**\n- Frontend Development (React, Vue, Angular)\n- Backend Development (Node.js, Python, Java)\n- Full-Stack Development Journey\n- Cybersecurity Career Path\n- Data Science & Machine Learning\n- Mobile App Development\n- Cloud Computing (AWS, Azure, GCP)\n- DevOps & System Administration\n\n**💡 Just tell me what you want to learn and I'll create a detailed roadmap for you!**\n\n*Example: \"I want to become a React developer\" or \"Create a cybersecurity roadmap for beginners\"*",
        timestamp: new Date()
      }]);
    }
  }, [showChatbot, messages.length, currentChatId]);

  // Auto-scroll to bottom of messages with improved behavior
  useEffect(() => {
    if (messagesEndRef.current) {
      const scrollContainer = messagesEndRef.current.parentElement;
      if (scrollContainer) {
        const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100;
        
        if (isNearBottom || messages.length <= 1) {
          messagesEndRef.current.scrollIntoView({ 
            behavior: "smooth", 
            block: "end" 
          });
        }
      }
    }
  }, [messages, isLoading]);

  // Create new chat
  const createNewChat = () => {
    const chatId = Date.now().toString();
    setCurrentChatId(chatId);
    setMessages([]);
    setShowHistory(false);
  };

  // Load existing chat
  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      const formattedMessages = formatMessages(chat.messages);
      setMessages(formattedMessages);
      setShowHistory(false);
    }
  };

  // Save current chat to history
  const saveCurrentChat = (newMessages, chatTitle = null) => {
    if (!currentChatId || newMessages.length <= 1) return;

    const formattedMessages = formatMessages(newMessages);

    const chatToSave = {
      id: currentChatId,
      title: chatTitle || generateChatTitle(formattedMessages),
      messages: formattedMessages,
      timestamp: new Date(),
      lastUpdated: new Date()
    };

    setChatHistory(prev => {
      const existingIndex = prev.findIndex(chat => chat.id === currentChatId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...chatToSave, lastUpdated: new Date() };
        return updated.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      } else {
        return [chatToSave, ...prev].slice(0, 50);
      }
    });
  };

  // Generate chat title from first user message
  const generateChatTitle = (messages) => {
    const firstUserMessage = messages.find(m => m.type === 'user');
    if (firstUserMessage) {
      const words = firstUserMessage.content.split(' ').slice(0, 6);
      return words.join(' ') + (firstUserMessage.content.split(' ').length > 6 ? '...' : '');
    }
    return 'New Roadmap Chat';
  };

  // Delete chat from history
  const deleteChat = (chatId, event) => {
    event.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  // Clear all chat history
  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to delete all chat history? This cannot be undone.')) {
      setChatHistory([]);
      localStorage.removeItem('nextstep_chat_history');
      setCurrentChatId(null);
      setMessages([]);
      setShowHistory(false);
    }
  };

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId);
  };

  // Updated handleStartInterview to use ConvoCore AI iframe
  const handleStartInterview = () => {
    if (selectedMode) {
      if (selectedMode === 'hr') {
        setShowHRInterview(true);
        setShowChatbot(false);
      } else if (selectedMode === 'technical') {
        alert(`Starting ${interviewModes.find(m => m.id === selectedMode)?.title}...`);
      } else if (selectedMode === 'mixed') {
        alert(`Starting ${interviewModes.find(m => m.id === selectedMode)?.title}...`);
      }
    } else {
      alert('Please select an interview mode first');
    }
  };

  // Updated navigation handlers
  const handleRoadmapClick = (e) => {
    e.preventDefault();
    setShowChatbot(true);
    setShowHRInterview(false);
    setShowHistory(false);
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    setShowChatbot(false);
    setShowHRInterview(false);
    setShowHistory(false);
    if (messages.length > 1) {
      saveCurrentChat(messages);
    }
  };

  // Close HR Interview
  const closeHRInterview = () => {
    setShowHRInterview(false);
  };

  const renderMessage = (content) => {
    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="roadmap-main-title">{children}</h1>,
          h2: ({ children }) => <h2 className="roadmap-main-title">{children}</h2>,
          h3: ({ children }) => <h3 className="roadmap-week-title">{children}</h3>,
          h4: ({ children }) => <h4 className="roadmap-sub-title">{children}</h4>,
          p: ({ children }) => {
            const text = typeof children === 'string' ? children : 
                        (Array.isArray(children) ? children.join('') : children?.toString() || '');
            
            if (text.startsWith('📺 YouTube:') || text.includes('📺 YouTube:')) {
              const urlMatch = text.match(/https?:\/\/[^\s]+/);
              if (urlMatch) {
                return (
                  <div className="youtube-link">
                    📺 <a href={urlMatch[0]} target="_blank" rel="noopener noreferrer">
                      YouTube Resource
                    </a>
                  </div>
                );
              }
            }
            return <p className="roadmap-text">{children}</p>;
          },
          ul: ({ children }) => <ul className="roadmap-list">{children}</ul>,
          ol: ({ children }) => <ol className="roadmap-ordered-list">{children}</ol>,
          li: ({ children }) => <li className="roadmap-list-item">{children}</li>,
          strong: ({ children }) => <strong className="roadmap-bold">{children}</strong>,
          em: ({ children }) => <em className="roadmap-italic">{children}</em>,
          blockquote: ({ children }) => <blockquote className="roadmap-quote">{children}</blockquote>,
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? 
              <code className="roadmap-inline-code">{children}</code> :
              <code className="roadmap-code-block">{children}</code>;
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="roadmap-link">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!currentChatId) {
      createNewChat();
    }

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const responseText = await generateRoadmapContent(inputMessage);
      
      const botMessage = {
        type: 'bot',
        content: responseText,
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      
      saveCurrentChat(finalMessages);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      let errorContent = "Sorry, I'm having trouble generating a response right now. ";
      
      if (error.message.includes('API key')) {
        errorContent += "**Please check your API configuration:**\n\n";
        errorContent += "1. Make sure your `.env.local` file contains `VITE_GEMINI_API_KEY`\n";
        errorContent += "2. Restart your development server after adding the API key\n";
        errorContent += "3. Verify your API key is valid at [Google AI Studio](https://aistudio.google.com/)";
      } else if (error.message.includes('quota') || error.message.includes('rate')) {
        errorContent += "**Rate limit reached.** Please wait a moment and try again.";
      } else {
        errorContent += "**Possible issues:**\n\n";
        errorContent += "- Check your internet connection\n";
        errorContent += "- Verify your API key has proper permissions\n";
        errorContent += "- Try again in a few moments";
      }

      const errorMessage = {
        type: 'bot',
        content: errorContent,
        timestamp: new Date()
      };
      
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      saveCurrentChat(finalMessages);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeChatbot = () => {
    setShowChatbot(false);
    setShowHistory(false);
    if (messages.length > 1) {
      saveCurrentChat(messages);
    }
    setMessages([]);
    setCurrentChatId(null);
    clearConversationHistory();
  };

  const quickPrompts = [
    "React.js full-stack development roadmap",
    "Cybersecurity career path for beginners", 
    "Data science learning journey with Python",
    "Backend development with Node.js and databases",
    "Mobile app development with React Native",
    "Cloud computing roadmap (AWS/Azure)"
  ];

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  // Safe timestamp formatting function
  const formatTimestamp = (timestamp) => {
    try {
      const date = ensureDate(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar - Always Fixed */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="logo-text">NextStep</div>
        </div>
        
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#" className={`nav-link ${!showChatbot && !showHRInterview ? 'active' : ''}`} onClick={handleDashboardClick}>
                <div className="nav-icon">📊</div>
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <div className="nav-icon">👤</div>
                Profile
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className={`nav-link ${showHRInterview ? 'active' : ''}`}>
                <div className="nav-icon">🎯</div>
                Interview Modes
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <div className="nav-icon">📈</div>
                Analytics
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <div className="nav-icon">📚</div>
                Resources
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className={`nav-link ${showChatbot ? 'active' : ''}`} onClick={handleRoadmapClick}>
                <div className="nav-icon">🗺️</div>
                Roadmap Generator
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <div className="nav-icon">⚙️</div>
                Settings
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{userData.name}</div>
              <div className="user-role">{userData.department}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-container">
        {showHRInterview ? (
          /* HR Interview with ConvoCore AI Iframe */
          <div className="hr-interview-container">
            <div className="hr-interview-header">
              <div className="hr-header-left">
                <div className="hr-title">
                  <span className="hr-icon">🎤</span>
                  <span className="hr-title-text">AI HR Interview Practice</span>
                  <span className="hr-status">● Live</span>
                </div>
              </div>
              <div className="hr-actions">
                <button className="hr-close" onClick={closeHRInterview} title="Close Interview">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="hr-interview-content">
              <iframe
                src="https://convocore.ai/app/na/render/GCxNx7BR1bE8kWOa/iframe"
                className="hr-interview-iframe"
                frameBorder="0"
                allow="microphone; camera"
                title="HR Interview Practice"
              ></iframe>
            </div>
          </div>
        ) : !showChatbot ? (
          /* Dashboard Content */
          <main className="dashboard-content">
            <header className="header">
              <div className="header-left">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Welcome back, {userData.name.split(' ')[0]}!</p>
              </div>
              <div className="header-right">
                <button className="notification-btn">
                  <span className="notification-icon">🔔</span>
                  <span className="notification-badge">3</span>
                </button>
              </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{userData.interviewsAttempted}</div>
                  <div className="stat-label">Interviews Completed</div>
                  <div className="stat-trend positive">↗ +12% from last month</div>
                </div>
                <div className="stat-icon">🎯</div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{userData.avgScore}</div>
                  <div className="stat-label">Average Score</div>
                  <div className="stat-trend positive">↗ +5 points improved</div>
                </div>
                <div className="stat-icon">📊</div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{userData.progressPercentage}%</div>
                  <div className="stat-label">Progress</div>
                  <div className="stat-trend positive">↗ On track</div>
                </div>
                <div className="stat-icon">🚀</div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">24</div>
                  <div className="stat-label">Skills Practiced</div>
                  <div className="stat-trend positive">↗ +3 this week</div>
                </div>
                <div className="stat-icon">💡</div>
              </div>
            </div>

            {/* Interview Modes */}
            <div className="interview-modes">
              <h2 className="section-title">Choose Interview Mode</h2>
              <div className="modes-grid">
                {interviewModes.map((mode) => (
                  <div 
                    key={mode.id}
                    className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
                    onClick={() => handleModeSelect(mode.id)}
                  >
                    <div className="mode-header">
                      <div className="mode-icon">{mode.icon}</div>
                      <div className="mode-title">{mode.title}</div>
                    </div>
                    <div className="mode-description">{mode.description}</div>
                    {selectedMode === mode.id && (
                      <div className="mode-selected-indicator">✓</div>
                    )}
                  </div>
                ))}
              </div>
              <button 
                className={`start-btn ${selectedMode ? 'enabled' : 'disabled'}`} 
                onClick={handleStartInterview}
                disabled={!selectedMode}
              >
                {selectedMode ? 'Start Interview' : 'Select a Mode First'}
              </button>
            </div>

            {/* Performance Analytics */}
            <div className="analytics-section">
              <h2 className="section-title">Performance Analytics</h2>
              <div className="analytics-grid">
                {performanceData.map((item, index) => (
                  <div key={index} className="analytics-card">
                    <div className="analytics-header">
                      <div className="analytics-type">{item.type}</div>
                      <div className={`analytics-trend ${item.trend}`}>
                        {item.trend === 'up' ? '↗' : '↘'}
                      </div>
                    </div>
                    <div className="analytics-score">
                      <span className="score-number">{item.score}</span>
                      <span className="score-suffix">%</span>
                    </div>
                    <div className="analytics-improvement">{item.improvement}</div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        ) : (
          /* Chatbot - keeping existing chatbot code */
          <div className="chatbot-fullscreen">
            {/* Chat History Sidebar */}
            <div className={`chat-history-sidebar ${showHistory ? 'open' : ''}`}>
              <div className="history-header">
                <h3>Chat History</h3>
                <div className="history-actions">
                  <button className="new-chat-btn" onClick={createNewChat} title="New Chat">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="close-history-btn" onClick={() => setShowHistory(false)}>✕</button>
                </div>
              </div>
              
              <div className="history-list">
                {chatHistory.length === 0 ? (
                  <div className="no-history">
                    <p>No chat history yet</p>
                    <p className="no-history-subtitle">Start a conversation to see it here</p>
                  </div>
                ) : (
                  chatHistory.map((chat) => (
                    <div 
                      key={chat.id} 
                      className={`history-item ${currentChatId === chat.id ? 'active' : ''}`}
                      onClick={() => loadChat(chat.id)}
                    >
                      <div className="history-content">
                        <div className="history-title">{chat.title}</div>
                        <div className="history-date">
                          {ensureDate(chat.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <button 
                        className="delete-chat-btn"
                        onClick={(e) => deleteChat(chat.id, e)}
                        title="Delete chat"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {chatHistory.length > 0 && (
                <div className="history-footer">
                  <button className="clear-all-btn" onClick={clearAllHistory}>
                    Clear All History
                  </button>
                </div>
              )}
            </div>

            {/* Main Chat Area */}
            <div className="chat-main-area">
              <div className="chatbot-header">
                <div className="header-left">
                  <button 
                    className="history-toggle-btn" 
                    onClick={() => setShowHistory(!showHistory)}
                    title="Toggle chat history"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <div className="chatbot-title">
                    <span className="chatbot-icon">🗺️</span>
                    <span className="chatbot-title-text">AI Roadmap Generator</span>
                    <span className="chatbot-status">● Online</span>
                  </div>
                </div>
                <div className="chatbot-actions">
                  <button className="new-chat-btn" onClick={createNewChat} title="New Chat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="chatbot-close" onClick={closeChatbot} title="Close Chatbot">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="quick-prompts-fullscreen">
                  <div className="quick-prompts-header">
                    <h3>🚀 Popular Learning Paths</h3>
                    <p>Click any option below or describe your learning goals</p>
                  </div>
                  <div className="quick-prompts-grid-fullscreen">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        className="quick-prompt-card"
                        onClick={() => handleQuickPrompt(prompt)}
                      >
                        <div className="prompt-icon">
                          {index === 0 && '⚛️'}
                          {index === 1 && '🔒'}
                          {index === 2 && '📊'}
                          {index === 3 && '⚙️'}
                          {index === 4 && '📱'}
                          {index === 5 && '☁️'}
                        </div>
                        <div className="prompt-text">{prompt}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="chatbot-messages-fullscreen">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-avatar">
                      {message.type === 'bot' ? (
                        <div className="bot-avatar">🤖</div>
                      ) : (
                        <div className="user-avatar-msg">
                          {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="message-content">
                      {message.type === 'bot' ? renderMessage(message.content) : (
                        <div className="user-message-text">{message.content}</div>
                      )}
                      <div className="message-timestamp">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message bot">
                    <div className="message-avatar">
                      <div className="bot-avatar">🤖</div>
                    </div>
                    <div className="message-content typing-fullscreen">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <div className="typing-text">AI is generating your roadmap...</div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chatbot-input-fullscreen">
                <div className="input-container">
                  <div className="input-wrapper">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe what you want to learn... (e.g., 'I want to become a full-stack developer')"
                      rows="1"
                      disabled={isLoading}
                      className="message-input-fullscreen"
                    />
                    <button 
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="send-button-fullscreen"
                    >
                      {isLoading ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="input-hint">
                    Press Enter to send • Shift + Enter for new line
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
