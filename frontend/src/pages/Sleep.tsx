
import React, { useEffect } from 'react';
import SleepTracker from '@/components/SleepTracker';
import { Moon, Bed } from 'lucide-react';
import AOS from 'aos';
import "aos/dist/aos.css";

const Sleep = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <main className="pt-24 pb-16">
        <div className="page-container">
          {/* Header */}
          <div className="mb-8 text-center" data-aos="fade-down">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Bed className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-blue-900">Sleep Tracking</h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Monitor and improve your sleep patterns to reduce overthinking and improve mental wellbeing
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            <div className="glass-panel p-6">
              <SleepTracker />
            </div>
            
            {/* Sleep Tips */}
            <div className="mt-8 grid md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="300">
              {[
                {
                  title: "Consistent Schedule",
                  description: "Go to bed and wake up at the same time every day, even on weekends.",
                  icon: <Moon className="w-5 h-5 text-blue-500" />
                },
                {
                  title: "Relaxing Environment",
                  description: "Keep your bedroom cool, dark, and quiet for optimal sleep quality.",
                  icon: <Bed className="w-5 h-5 text-blue-500" />
                },
                {
                  title: "Wind Down Routine",
                  description: "Develop a pre-sleep routine to signal your body it's time to relax.",
                  icon: <Moon className="w-5 h-5 text-blue-500" />
                }
              ].map((tip, index) => (
                <div key={index} className="glass-panel p-4">
                  <div className="flex items-center mb-2">
                    {tip.icon}
                    <h3 className="ml-2 font-medium text-blue-900">{tip.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sleep;
