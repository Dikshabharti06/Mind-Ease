
import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { Bot, Shield } from 'lucide-react';
import AOS from 'aos';
import "aos/dist/aos.css";

const Chat = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <main className="pt-24 pb-16">
        <div className="page-container">
          {/* Header */}
          <div className="mb-8" data-aos="fade-down">
            <h1 className="text-3xl font-bold flex items-center text-indigo-900">
              <Bot className="w-8 h-8 mr-3 text-indigo-600" />
              AI Wellness Assistant
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-center">
              Chat with our AI assistant for emotional support, mindfulness guidance, and techniques to overcome overthinking
            </p>
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto h-[70vh]" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-white/30 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-white/30">
              <ChatInterface />
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto mt-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg" data-aos="fade-up" data-aos-delay="400">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> This AI chat is designed to provide emotional support and general wellness advice. 
                It is not a replacement for professional mental health care. If you're experiencing a crisis or need immediate help, 
                please contact a mental health professional or a crisis helpline.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
