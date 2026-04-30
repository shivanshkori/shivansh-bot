import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Calendar, FileText, CheckCircle, Info, RefreshCw, ChevronRight } from 'lucide-react';

const INITIAL_MESSAGE = {
  id: '1',
  type: 'bot',
  text: "Hello! I'm your Election Assistant. I can help you understand the voting process, registration steps, and important timelines. What would you like to know about today?",
  options: [
    { id: 'reg', label: 'Voter Registration', icon: <FileText size={16} /> },
    { id: 'time', label: 'Election Timeline', icon: <Calendar size={16} /> },
    { id: 'docs', label: 'Required Documents', icon: <CheckCircle size={16} /> }
  ]
};

const RESPONSES = {
  reg: {
    text: "Registration is the first step to becoming a voter! Here is the process:\n\n1. **Eligibility**: You must be a citizen and 18+ years old.\n2. **Form 6**: Fill out Form 6 on the official Voter Portal (voters.eci.gov.in).\n3. **Verification**: A Booth Level Officer (BLO) will visit for field verification.\n4. **EPIC Card**: Once approved, your Voter ID card will be sent via post.\n\nWould you like more details on something else?",
    options: [
      { id: 'docs', label: 'What documents do I need?', icon: <CheckCircle size={16} /> },
      { id: 'time', label: 'When is the deadline?', icon: <Calendar size={16} /> },
      { id: 'init', label: 'Go Back', icon: <RefreshCw size={16} /> }
    ]
  },
  time: {
    text: "The 2026 State Elections follow a specific timeline. While exact dates vary by constituency, the general flow is:\n\n• **Phase 1 Notification**: April 10, 2026\n• **Last Date for Nominations**: April 17, 2026\n• **Polling Day**: May 15, 2026\n• **Counting of Votes**: May 19, 2026\n\nMake sure your name is in the Electoral Roll at least 3 weeks before polling!",
    options: [
      { id: 'reg', label: 'How do I register?', icon: <FileText size={16} /> },
      { id: 'init', label: 'Go Back', icon: <RefreshCw size={16} /> }
    ]
  },
  docs: {
    text: "To register or vote, you'll need to prove your identity and address. Common documents include:\n\n• **Identity**: Aadhaar Card, PAN Card, or Passport.\n• **Address**: Electricity bill, Gas connection bill, or Bank passbook.\n• **Age**: Birth certificate or Class 10 Marksheet.\n\nYou can upload digital copies directly on the portal!",
    options: [
      { id: 'reg', label: 'Start Registration', icon: <FileText size={16} /> },
      { id: 'init', label: 'Go Back', icon: <RefreshCw size={16} /> }
    ]
  },
  eligibility: {
    text: "To be eligible to vote in India, you must meet these criteria:\n\n1. **Nationality**: You must be an Indian citizen.\n2. **Age**: You must be **18 years or older** on the qualifying date (usually January 1st of the election year).\n3. **Residence**: You must be an ordinary resident in the constituency where you want to vote.\n4. **No Disqualification**: You must not be disqualified due to unsound mind or criminal records specified by law.\n\nAre you 18 or above? If so, you should register!",
    options: [
      { id: 'reg', label: 'How to register?', icon: <FileText size={16} /> },
      { id: 'init', label: 'Go Back', icon: <RefreshCw size={16} /> }
    ]
  },
  init: INITIAL_MESSAGE
};

function App() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleBotResponse = (id) => {
    setIsTyping(true);
    setTimeout(() => {
      const responseData = RESPONSES[id] || {
        text: "I'm sorry, I don't have specific information on that yet. You can find official details on the Voter Portal: **voters.eci.gov.in**",
        options: [
          { id: 'init', label: 'Go Back', icon: <RefreshCw size={16} /> }
        ]
      };
      const botMsg = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: responseData.text,
        options: responseData.options
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleOptionClick = (optionId, label) => {
    const userMsg = { id: Date.now().toString(), type: 'user', text: label };
    setMessages(prev => [...prev, userMsg]);
    handleBotResponse(optionId);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.toLowerCase();
    const userMsg = { id: Date.now().toString(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    let responseId = 'unknown';
    
    const isRegistration = query.includes('register') || query.includes('form 6') || query.includes('apply') || query.includes('enroll');
    const isTimeline = query.includes('date') || query.includes('when') || query.includes('timeline') || query.includes('polling') || query.includes('schedule');
    const isDocuments = query.includes('document') || query.includes('id') || query.includes('proof') || query.includes('aadhaar') || query.includes('voter id');
    const isEligibility = query.includes('able') || query.includes('eligible') || query.includes('can i') || query.includes('criteria') || query.includes('age') || query.includes('citizen');

    if (isEligibility) {
      responseId = 'eligibility';
    } else if (isRegistration) {
      responseId = 'reg';
    } else if (isTimeline) {
      responseId = 'time';
    } else if (isDocuments) {
      responseId = 'docs';
    } else if (query.includes('hello') || query.includes('hi')) {
      responseId = 'init';
    }

    handleBotResponse(responseId);
  };

  return (
    <div className="pro-panel" style={{ width: '90%', maxWidth: '480px', height: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Professional Header */}
      <header style={{ 
        padding: '16px 20px', 
        background: 'var(--header-bg)', 
        color: 'white',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px' }}>
            <Bot color="white" size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.02em' }}>Election Assistant</h2>
            <span style={{ fontSize: '0.7rem', color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{ width: '5px', height: '5px', background: '#4ade80', borderRadius: '50%' }}></span>
              Official Voter Guide
            </span>
          </div>
        </div>
        <button 
          onClick={() => setMessages([INITIAL_MESSAGE])}
          style={{ background: 'transparent', border: 'none', color: '#93c5fd', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
        >
          <RefreshCw size={14} /> Reset
        </button>
      </header>

      {/* Chat Messages */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
            <div className={`chat-bubble ${msg.type === 'bot' ? 'bot-bubble' : 'user-bubble'}`}>
              <div style={{ whiteSpace: 'pre-wrap', marginBottom: msg.options ? '14px' : 0 }}>
                {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} style={{ color: msg.type === 'bot' ? 'var(--primary-accent)' : 'inherit' }}>{part}</strong> : part)}
              </div>
              
              {msg.type === 'bot' && msg.options && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {msg.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionClick(opt.id, opt.label)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary-accent)';
                        e.currentTarget.style.color = 'var(--primary-accent)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-main)';
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {React.cloneElement(opt.icon, { size: 14 })}
                        {opt.label}
                      </span>
                      <ChevronRight size={12} style={{ opacity: 0.4 }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0 4px' }}>
              {msg.type === 'bot' ? 'Assistant' : 'You'}
            </span>
          </div>
        ))}
        
        {isTyping && (
          <div className="chat-bubble bot-bubble" style={{ display: 'flex', gap: '2px', padding: '12px 16px' }}>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Professional Input Area */}
      <footer style={{ padding: '20px', borderTop: '1px solid var(--border-color)', background: '#ffffff' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question here..."
            style={{
              flex: 1,
              background: '#f1f5f9',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '12px 14px',
              paddingRight: '48px',
              color: 'var(--text-main)',
              outline: 'none',
              fontSize: '0.9rem',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            style={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--primary-accent)',
              border: 'none',
              borderRadius: '6px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: inputValue.trim() ? 1 : 0.4,
              transition: 'background 0.2s'
            }}
          >
            <Send size={18} color="white" />
          </button>
        </form>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '12px', 
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #f1f5f9'
        }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Info size={10} /> Official Information Service
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>•</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Voter Portal 2026</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
