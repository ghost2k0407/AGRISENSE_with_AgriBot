import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, History, Home, Trash2, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

// Direct API call function
const askAgriBot = async (message: string): Promise<string> => {
  const response = await fetch('http://localhost:8000/agrobot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch response from AgriBot');
  }

  const data = await response.json();
  return data.response;
};


export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: 'bot',
      content: 'Hello! I\'m AgriBot Pro, your smart agriculture assistant. I can help you with questions about crops, pests, soil management, fertilizers, and farming best practices. What would you like to know?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    id: string;
    title: string;
    messages: { role: string; content: string }[];
    timestamp: Date;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save current chat to history
  const saveCurrentChat = () => {
    if (messages.length <= 1) return; // Don't save if only welcome message

    const firstUserMessage = messages.find(msg => msg.role === 'user')?.content || 'New Chat';
    const chatTitle = firstUserMessage.length > 50 
      ? firstUserMessage.substring(0, 50) + '...' 
      : firstUserMessage;

    const newChat = {
      id: Date.now().toString(),
      title: chatTitle,
      messages: [...messages],
      timestamp: new Date()
    };

    setChatHistory(prev => [newChat, ...prev]);
  };

  // Load a chat from history
  const loadChat = (chat: typeof chatHistory[0]) => {
    setMessages(chat.messages);
    setShowHistory(false);
  };

  // Delete a chat from history
  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  };

  // Start new chat
  const startNewChat = () => {
    if (messages.length > 1) {
      saveCurrentChat();
    }
    setMessages([
      {
        role: 'bot',
        content: 'Hello! I\'m AgriBot Pro, your smart agriculture assistant. I can help you with questions about crops, pests, soil management, fertilizers, and farming best practices. What would you like to know?'
      }
    ]);
    setShowHistory(false);
  };

  // Navigate back to home (placeholder - you can implement actual navigation)
  const navigateToHome = () => {
    if (messages.length > 1) {
      saveCurrentChat();
    }
    navigate('/');
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await askAgriBot(userMessage);
      setMessages([...newMessages, { role: 'bot', content: reply }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setMessages([...newMessages, { 
        role: 'bot', 
        content: `Sorry, I encountered an error: ${errorMessage} Please try again.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Chat History Sidebar */}
      {showHistory && (
        <div className="w-80 bg-white border-r border-green-200 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800">Chat History</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <button
            onClick={startNewChat}
            className="w-full mb-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          <div className="space-y-2">
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">No chat history yet</p>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadChat(chat)}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chat.timestamp.toLocaleDateString()} {chat.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-red-500 hover:text-red-700 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              🌾 AgriBot Pro – Smart Agriculture Chatbot
            </h1>
            <p className="text-green-600 text-sm">
              Powered by Gemini 2.5 Pro
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center space-x-2"
              title="Chat History"
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button
              onClick={startNewChat}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center space-x-2"
              title="New Chat"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
            <button
              onClick={navigateToHome}
              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center space-x-2"
              title="Back to Home"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 mb-2 ${
                  msg.role === 'user'
                    ? 'bg-yellow-200 text-right self-end'
                    : 'bg-green-100 self-start'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {msg.role === 'bot' && (
                    <Bot className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    {msg.role === 'bot' ? (
                      <div className="text-gray-800 prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            // Customize markdown components for better styling
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            code: ({ children }) => (
                              <code className="bg-green-200 px-1 py-0.5 rounded text-sm">{children}</code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-green-200 p-2 rounded text-sm overflow-x-auto">{children}</pre>
                            ),
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <User className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-green-100 self-start rounded-lg p-3 mb-2">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-green-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-green-600 text-sm">AgriBot is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about crops, pests, soil, fertilizers..."
            className="flex-1 rounded-lg border border-green-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}