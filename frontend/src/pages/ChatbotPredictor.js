import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api'; // Use the central API instance

const ChatbotPredictor = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Habari! Nitakusaidia kutabiri mahitaji ya maji katika eneo lako.", sender: 'bot' },
    { id: 2, text: "Je, ni joto gani sasa hivi (°C)?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState(0); 
  const [inputs, setInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const messagesEndRef = useRef(null);

  // The 'question' string here is what the bot asks AFTER this key is answered, to get the NEXT key.
  const steps = [
    { key: 'temperature', question: "Vizuri! Sasa, ni mvua kiasi gan imenyesha hivi karibuni (mm)?", type: 'number' },
    { key: 'rainfall', question: "Nzuri. Kiwango cha maji katika chanzo kwa sasa (mita au cm)?", type: 'number' },
    { key: 'water_level', question: "Idadi ya watu katika eneo hilo ni wangapi?", type: 'number' },
    { key: 'population', question: "Eneo hilo liko wilaya/mtaa gani? (mfano: Ilala, Kinondoni, Mbeya)", type: 'text' },
    { key: 'district', question: "Inachakata utabiri wako..." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    
    let value = inputValue;
    const currentStepConfig = steps[step];
    
    if (currentStepConfig.type === 'number') {
        value = parseFloat(inputValue);
        if (isNaN(value)) {
            setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now()+1, text: "Tafadhali ingiza nambari sahihi.", sender: 'bot' }]);
            }, 500);
            setInputValue('');
            return;
        }
    }

    setInputValue('');
    const newInputs = { ...inputs, [currentStepConfig.key]: value };
    setInputs(newInputs);

    if (step < steps.length - 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now()+1, text: steps[step].question, sender: 'bot' }]);
        setStep(step + 1);
      }, 500);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now()+2, text: steps[step].question, sender: 'bot' }]);
        setIsLoading(true);
      }, 500);
      
      try {
        const response = await api.post('/predict-demand/', newInputs);
        const prediction = response.data.predicted_demand;
        setTimeout(() => {
          setIsLoading(false);
          setPredictionResult({ value: Math.round(prediction), inputs: newInputs });
          setMessages(prev => [...prev, { 
            id: Date.now()+3, 
            sender: 'bot',
            isPrediction: true
          }]);
        }, 1500);
      } catch (error) {
        setIsLoading(false);
        setMessages(prev => [...prev, { 
          id: Date.now()+4, 
          text: `Samahani, hitilafu imetokea: ${error.message}. Tafadhali hakikisha seva inafanya kazi.`, 
          sender: 'bot',
          isError: true
        }]);
      }
    }
  };

  const resetChat = () => {
    setMessages([
      { id: 1, text: "Habari! Nitakusaidia kutabiri mahitaji ya maji katika eneo lako.", sender: 'bot' },
      { id: 2, text: "Je, ni joto gani sasa hivi (°C)?", sender: 'bot' }
    ]);
    setStep(0);
    setInputs({});
    setPredictionResult(null);
  };

  const isNumericInput = step < steps.length && steps[step].type === 'number';

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#181818] rounded-2xl shadow-2xl overflow-hidden border border-[#282828] flex flex-col" style={{ height: '80vh' }}>
        
        {/* Header */}
        <div className="bg-[#1e1e1e] p-4 flex justify-between items-center border-b border-[#282828]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-lg tracking-wide">ULIZA UPATE UTABIRI</h2>
              <p className="text-xs text-green-400 font-medium tracking-wider">● MTANDAONI</p>
            </div>
          </div>
          <button onClick={resetChat} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#121212] to-[#181818]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.isPrediction && predictionResult ? (
                /* ── Rich Prediction Card ── */
                <div style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                  border: '1px solid rgba(99,199,255,0.25)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 0 30px rgba(0,150,255,0.15)',
                  animation: 'fadeSlideUp 0.5s ease',
                }}>
                  {/* Card Header */}
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#00c6ff,#0072ff)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z"/></svg>
                    </div>
                    <div>
                      <p style={{ color:'#aad4ff', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', margin:0 }}>Matokeo ya Utabiri</p>
                      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'10px', margin:0 }}>Inayotolewa na Muundo wa AI</p>
                    </div>
                  </div>

                  {/* Big Number */}
                  <div style={{ textAlign:'center', margin:'16px 0 20px' }}>
                    <p style={{ color:'rgba(170,212,255,0.7)', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', margin:'0 0 4px' }}>Mahitaji ya Maji Yanatarajiwa</p>
                    <p style={{ fontSize:'42px', fontWeight:900, background:'linear-gradient(90deg,#00c6ff,#0072ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0, lineHeight:1 }}>
                      {predictionResult.value.toLocaleString()}
                    </p>
                    <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'12px', marginTop:'4px' }}>lita / siku</p>
                  </div>

                  {/* Divider */}
                  <div style={{ height:'1px', background:'rgba(99,199,255,0.15)', margin:'0 0 16px' }} />

                  {/* Input Summary Grid */}
                  <p style={{ color:'rgba(170,212,255,0.6)', fontSize:'10px', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'10px' }}>Taarifa Ulizotoa</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                    {[
                      { label:'🌡️ Joto', value: `${predictionResult.inputs.temperature}°C` },
                      { label:'🌧️ Mvua', value: `${predictionResult.inputs.rainfall} mm` },
                      { label:'💧 Kiwango Maji', value: predictionResult.inputs.water_level },
                      { label:'👥 Watu', value: Number(predictionResult.inputs.population).toLocaleString() },
                      { label:'📍 Wilaya', value: predictionResult.inputs.district },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ background:'rgba(255,255,255,0.05)', borderRadius:'10px', padding:'8px 12px' }}>
                        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'10px', margin:'0 0 2px' }}>{label}</p>
                        <p style={{ color:'#fff', fontSize:'13px', fontWeight:600, margin:0 }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reset button */}
                  <button onClick={resetChat} style={{ marginTop:'16px', width:'100%', padding:'10px', borderRadius:'10px', border:'1px solid rgba(0,198,255,0.3)', background:'rgba(0,114,255,0.15)', color:'#00c6ff', fontSize:'13px', fontWeight:700, cursor:'pointer', letterSpacing:'0.5px', transition:'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(0,114,255,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.background='rgba(0,114,255,0.15)'}>
                    🔄 Uliza Tena
                  </button>

                  <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
                </div>
              ) : (
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : msg.isError
                      ? 'bg-red-900/50 border border-red-500 text-red-200'
                      : 'bg-[#282828] text-gray-200 rounded-bl-none'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#282828] p-4 rounded-2xl rounded-bl-none flex space-x-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#1e1e1e] border-t border-[#282828]">
          <form onSubmit={handleSend} className="relative">
            <input
              type={isNumericInput ? "number" : "text"}
              step={isNumericInput ? "any" : undefined}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={step >= steps.length || isLoading}
              placeholder={step >= steps.length ? "Utabiri umekamilika..." : isNumericInput ? "Andika nambari..." : "Andika jibu..."}
              className="w-full bg-[#121212] border border-[#333] rounded-full py-3 pl-5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={step >= steps.length || isLoading || !inputValue.trim()}
              className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V6m0 0l-5 5m5-5l5 5"></path></svg>
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default ChatbotPredictor;
