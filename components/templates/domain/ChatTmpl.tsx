
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Search, Plus, Send } from 'lucide-react';

export const ChatTmpl: React.FC = () => {
    const theme = useTheme();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, user: 'Justin Saadein', time: '10:42 AM', text: 'Has the budget baseline been approved by the steering committee yet?', initial: 'JS', color: 'blue', isMe: false },
        { id: 2, user: 'Mike Ross', time: '10:45 AM', text: 'Yes, just received the signed minutes. I\'ll upload them to the Document module now.', initial: 'MR', color: 'purple', isMe: true }
    ]);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, { 
            id: Date.now(), 
            user: 'Mike Ross', 
            time: 'Just now', 
            text: input, 
            initial: 'MR', 
            color: 'purple',
            isMe: true 
        }]);
        setInput('');
    };

    return (
        <div className={`h-full flex ${theme.colors.surface} border ${theme.colors.border} rounded-xl overflow-hidden m-4 shadow-lg`}>
            {/* Sidebar */}
            <div className={`w-72 bg-slate-50 border-r ${theme.colors.border} flex flex-col`}>
                <div className={`p-4 border-b ${theme.colors.border}`}>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input className={`w-full ${theme.colors.surface} border ${theme.colors.border} rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-nexus-500`} placeholder="Find channel..."/>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-6">
                    <div>
                        <h4 className="px-3 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Projects</h4>
                        <div className="space-y-1">
                            <div className="px-3 py-2 bg-nexus-100 text-nexus-800 rounded-lg text-sm font-bold cursor-pointer"># project-alpha</div>
                            <div className="px-3 py-2 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium cursor-pointer"># smart-city</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="px-3 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Direct Messages</h4>
                        <div className="space-y-1">
                            <div className="px-3 py-2 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div> Jessica Pearson
                            </div>
                            <div className="px-3 py-2 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2">
                                <div className="w-2 h-2 bg-slate-300 rounded-full"></div> Mike Ross
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                <div className={`p-4 border-b border-slate-100 flex justify-between items-center shadow-sm z-10`}>
                    <div>
                        <h3 className="font-bold text-slate-800"># project-alpha</h3>
                        <p className="text-xs text-slate-500">General discussion for Project Alpha initiative.</p>
                    </div>
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">U{i}</div>)}
                    </div>
                </div>
                
                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-slate-50/30">
                    <div className="flex justify-center">
                        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today</span>
                    </div>

                    {messages.map(msg => (
                        <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-${msg.color}-700 font-bold shrink-0 bg-${msg.color}-100`}>
                                {msg.initial}
                            </div>
                            <div className={`${msg.isMe ? 'text-right' : ''}`}>
                                <div className={`flex items-baseline gap-2 ${msg.isMe ? 'justify-end' : ''}`}>
                                    <span className="text-sm font-bold text-slate-900">{msg.user}</span>
                                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                                </div>
                                <div className={`text-sm p-3 rounded-2xl shadow-sm border border-slate-100 mt-1 ${msg.isMe ? 'bg-nexus-600 text-white rounded-tr-none text-left' : 'bg-white text-slate-700 rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className={`p-4 bg-white border-t border-slate-200`}>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><Plus size={20}/></button>
                        <Input 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder="Message #project-alpha..." 
                            className="border-slate-200 bg-slate-50 focus:bg-white" 
                        />
                        <Button icon={Send} onClick={sendMessage}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
