import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  User, 
  Bot, 
  BrainCircuit, 
  HelpCircle,
  Wheat,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { UserProfile, WeatherCondition, WeatherScenarioMode } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isAiGrounded?: boolean;
}

interface AIAssistantScreenProps {
  user: UserProfile;
  weather: WeatherCondition;
  scenario: WeatherScenarioMode;
  language: 'en' | 'hi';
}

export const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({
  user,
  weather,
  scenario,
  language
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: language === 'hi' 
        ? `नमस्ते ${user.name}! मैं MAUSAM IMD मौसम सहायक हूँ। आपके लिए (${user.userType}) मौसम संबंधी कोई भी सवाल पूछें—जैसे "क्या आज छाता ले जाना चाहिए?" या "मेरे कॉलेज/खेत में मौसम कैसा है?"।` 
        : `Hello ${user.name}! I am MAUSAM IMD, your context-aware weather intelligence assistant. Ask me questions tailored for your ${user.userType.replace('_', ' ')} routine—like "Should I carry an umbrella?", "Will it rain today?", or "What is the weather at my college?"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAiGrounded: true
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert(language === 'hi' ? 'ब्राउज़र में वॉइस स्पीच उपलब्ध नहीं है।' : 'Voice recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSpeakText = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(msgId);
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          userId: user.id,
          weatherScenario: scenario
        })
      });

      const data = await response.json();
      const replyText = data.reply || (language === 'hi' ? 'मौसम विश्लेषण प्राप्त हुआ।' : 'Weather intelligence received.');

      const assistantMessage: Message = {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAiGrounded: true
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: 'ast_err_' + Date.now(),
        sender: 'assistant',
        text: language === 'hi'
          ? 'वर्तमान में तापमान ' + weather.temp + '°C है। वर्षा की संभावना ' + weather.rainProb + '% है। स्थानीय सावधानी बरतें।'
          : `Current temperature is ${weather.temp}°C with ${weather.rainProb}% rain probability. Please follow safety guidelines for ${user.userType}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Preset query pills
  const presetQueries = language === 'hi' ? [
    'क्या आज शाम आउटडोर पार्टी या शादी के लिए मौसम अनुकूल है?',
    'क्या मुझे पौधों में पानी देना चाहिए?',
    'क्या आज रात पाले (Frost) का खतरा है?',
    'क्या आज फसलों में दवा छिड़क सकते हैं?',
    'लू और धूप से पौधों व स्वास्थ्य का बचाव कैसे करें?'
  ] : [
    'Is it comfortable for an outdoor evening event today?',
    'What is the event comfort index for gatherings?',
    'Should I water my plants today?',
    'Is there a frost risk tonight?',
    'How should I protect my indoor plants?'
  ];

  return (
    <div id="ai-assistant-screen" className="flex flex-col h-[calc(100vh-130px)] max-w-md mx-auto px-4 pt-2 pb-20 animate-fade-in">
      {/* Assistant Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/70 border border-indigo-500/30 rounded-2xl p-3 mb-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-xs font-bold text-white">MAUSAM IMD Meteorological Intelligence</h2>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Grounded on IMD Forecasts & {user.userType.replace('_', ' ')} persona
            </p>
          </div>
        </div>
      </div>

      {/* Preset Query Chips Carousel */}
      <div className="flex space-x-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            id={`preset-query-${idx}`}
            onClick={() => handleSendQuery(q)}
            className="shrink-0 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-850 bg-slate-800/80 hover:bg-slate-700 text-sky-300 border border-slate-700/80 transition-colors cursor-pointer"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* Messages List Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center text-white ${
                isUser 
                  ? 'bg-sky-500 text-xs font-bold' 
                  : 'bg-gradient-to-tr from-indigo-500 to-sky-500 shadow-sm'
              }`}>
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                isUser 
                  ? 'bg-sky-500 text-white rounded-tr-none' 
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none shadow-md'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                
                <div className={`flex items-center justify-between mt-1.5 pt-1 text-[10px] ${
                  isUser ? 'text-sky-100' : 'text-slate-400 border-t border-slate-700/40'
                }`}>
                  <span className="font-mono">{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeakText(msg.id, msg.text)}
                      className="p-1 hover:text-sky-400 transition-colors cursor-pointer"
                      title="Read out text"
                    >
                      {isSpeaking === msg.id ? (
                        <VolumeX className="w-3 h-3 text-sky-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start space-x-2">
            <div className="w-7 h-7 rounded-xl shrink-0 bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-white">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-800/90 border border-slate-700/70 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-bounce delay-200" />
              <span className="text-[11px] text-slate-400 ml-1">Analyzing meteorological models...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="mt-2 bg-slate-900/95 border border-slate-800 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md flex items-center space-x-2">
        {/* Voice Input Button */}
        <button
          id="ai-mic-btn"
          onClick={toggleMic}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isListening 
              ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-500/50' 
              : 'bg-slate-800 text-slate-300 hover:text-white'
          }`}
          title={isListening ? 'Listening... Speak now' : 'Voice Query'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-sky-400" />}
        </button>

        <input
          id="ai-text-input"
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
          placeholder={isListening 
            ? (language === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening... Speak now...') 
            : (language === 'hi' ? 'मौसम के बारे में कुछ भी पूछें...' : 'Ask MAUSAM IMD anything...')}
          className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none px-2"
        />

        <button
          id="ai-send-btn"
          onClick={() => handleSendQuery()}
          disabled={!inputQuery.trim() || isLoading}
          className="p-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white disabled:opacity-40 hover:from-sky-400 hover:to-indigo-500 transition-all cursor-pointer shadow-md shadow-sky-500/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
