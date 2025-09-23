import React, { useState, useRef, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import ReactMarkdown from 'react-markdown';
import { generateRoadmapContent, clearConversationHistory } from './services/geminiModel';
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useUser();
  const [selectedMode, setSelectedMode] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data - replace with actual data from your backend
  const userData = {
    name: user?.fullName || "John Doe",
    department: "Computer Science",
    year: "3rd Year",
    avgScore: 78,
    interviewsAttempted: 5,
    progressPercentage: 65
  };

  const interviewModes = [
    { id: 'hr', title: 'HR Interview', icon: '👤' },
    { id: 'technical', title: 'Technical Interview', icon: '💻' },
    { id: 'mixed', title: 'Mixed Mode', icon: '💬' }
  ];

  const performanceData = [
    {
      type: 'Technical',
      score: 65,
      improvement: 'Improve answers about OOP'
    }
  ];

  // Initialize chatbot with greeting message
  useEffect(() => {
    if (showChatbot && messages.length === 0) {
      setMessages([{
        type: 'bot',
        content: "👋 Hi! I'm your **Roadmap Assistant**. I can create week-wise learning plans with YouTube resources. What roadmap would you like to explore?\n\n**Popular Examples:**\n- Frontend development roadmap\n- Backend development with Node.js\n- Cybersecurity learning path\n- Data science career roadmap\n- Python programming for beginners\n- React.js mastery plan",
        timestamp: new Date()
      }]);
    }
  }, [showChatbot, messages.length]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleModeSelect = (modeId) => {
    setSelectedMode(modeId);
  };

  const handleStartInterview = () => {
    if (selectedMode) {
      alert(`Starting ${interviewModes.find(m => m.id === selectedMode)?.title}...`);
    } else {
      alert('Please select an interview mode first');
    }
  };

  const handleRoadmapClick = (e) => {
    e.preventDefault();
    setShowChatbot(true);
  };

  // Enhanced message rendering with Markdown support
  const renderMessage = (content) => {
    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="roadmap-main-title">{children}</h1>,
          h2: ({ children }) => <h2 className="roadmap-main-title">{children}</h2>,
          h3: ({ children }) => <h3 className="roadmap-week-title">{children}</h3>,
          h4: ({ children }) => <h4 className="roadmap-sub-title">{children}</h4>,
          p: ({ children }) => {
            // Handle YouTube links specially
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

  // Updated sendMessage function to use direct Gemini API
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Use the Gemini service instead of fetch
      const responseText = await generateRoadmapContent(inputMessage);
      
      const botMessage = {
        type: 'bot',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      let errorContent = "Sorry, I'm having trouble generating a response right now. ";
      
      if (error.message.includes('API key')) {
        errorContent += "**Please check your API configuration:**\n\n";
        errorContent += "1. Make sure your `.env` file contains `VITE_GEMINI_API_KEY`\n";
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
      
      setMessages(prev => [...prev, errorMessage]);
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
    setMessages([]);
    clearConversationHistory(); // Clear Gemini conversation history
  };

  // Quick prompt suggestions
  const quickPrompts = [
    "React.js full-stack roadmap",
    "Cybersecurity career path",
    "Data science learning plan",
    "Backend development with Node.js"
  ];

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">↗</div>
          <div className="logo-text">NextStep</div>
        </div>
        
        <nav>
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="#" className="nav-link active">
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
              <a href="#" className="nav-link">
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
              <a href="#" className="nav-link" onClick={handleRoadmapClick}>
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
      </aside>

      {/* Main Content */}
      <main className={`main-content ${showChatbot ? 'with-chatbot' : ''}`}>
        <header className="header">
          <h1 className="page-title">Profile</h1>
          <div className="user-info">
            <span className="user-name">{userData.name}</span>
            <div className="avatar">
              {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          </div>
        </header>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-avatar">
              {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="profile-details">
              <h2>{userData.name}</h2>
              <p>{userData.department}, {userData.year}</p>
            </div>
          </div>
          <a href="#" className="upload-btn">
            ⬆ Upload Resume
          </a>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <h2 className="section-title">Progress</h2>
          <div className="progress-info">
            <span className="progress-label">No. of Interviews attempted</span>
            <div className="avg-score">Avg. Score <strong>{userData.avgScore}</strong></div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${userData.progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Interview Modes */}
        <div className="interview-modes">
          <h2 className="section-title">Interview Modes</h2>
          <div className="modes-grid">
            {interviewModes.map((mode) => (
              <div 
                key={mode.id}
                className={`mode-card ${selectedMode === mode.id ? 'selected' : ''}`}
                onClick={() => handleModeSelect(mode.id)}
              >
                <div className="mode-icon">{mode.icon}</div>
                <div className="mode-title">{mode.title}</div>
              </div>
            ))}
          </div>
          <button className="start-btn" onClick={handleStartInterview}>
            Start Interview
          </button>
        </div>

        {/* Performance Analytics */}
        <div className="analytics-section">
          <h2 className="section-title">Performance Analytics</h2>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Recent Interviews</th>
                <th>Score Breakdown</th>
                <th>Suggested Improvements</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((item, index) => (
                <tr key={index}>
                  <td>
                    {item.type} 
                    <span className={`score-badge ${item.score >= 70 ? 'good' : item.score >= 50 ? 'average' : 'poor'}`}>
                      {item.score}
                    </span>
                  </td>
                  <td>{item.score}</td>
                  <td>{item.improvement}</td>
                  <td><a href="#" className="view-details">View Details</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Chatbot Panel */}
      {showChatbot && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-icon">🗺️</span>
              Roadmap Generator
            </div>
            <button className="chatbot-close" onClick={closeChatbot}>×</button>
          </div>
          
          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="quick-prompts">
              <div className="quick-prompts-label">Quick Start:</div>
              <div className="quick-prompts-grid">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="quick-prompt-btn"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  {message.type === 'bot' ? renderMessage(message.content) : (
                    <div className="user-message-text">{message.content}</div>
                  )}
                </div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for a learning roadmap... (e.g., 'React development roadmap')"
              rows="2"
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              {isLoading ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
