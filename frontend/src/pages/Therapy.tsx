
import React, { useEffect } from 'react';
import TherapyConsultation from '@/components/TherapyConsultation';
import { HeartPulse, Shield, UserCheck } from 'lucide-react';
import AOS from 'aos';
import "aos/dist/aos.css";

const Therapy = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50">
      <main className="pt-24 pb-16">
        <div className="page-container">
          {/* Header */}
          <div className="mb-12 text-center" data-aos="fade-down">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <HeartPulse className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-purple-900">Professional Therapy</h1>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Connect with licensed therapists specialized in overthinking, anxiety, and mental wellness
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            <div className="glass-panel p-6">
              <TherapyConsultation />
            </div>
            
            {/* Benefits */}
            <div className="mt-12" data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-2xl font-semibold text-center mb-6 text-purple-900">Benefits of Professional Therapy</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Expert Guidance",
                    description: "Get personalized strategies from licensed professionals.",
                    icon: <UserCheck className="w-5 h-5 text-purple-500" />
                  },
                  {
                    title: "Confidential Space",
                    description: "Share your thoughts in a private, judgment-free environment.",
                    icon: <Shield className="w-5 h-5 text-purple-500" />
                  },
                  {
                    title: "Evidence-Based Methods",
                    description: "Benefit from scientifically proven therapeutic approaches.",
                    icon: <HeartPulse className="w-5 h-5 text-purple-500" />
                  }
                ].map((benefit, index) => (
                  <div key={index} className="glass-panel p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        {benefit.icon}
                      </div>
                      <h3 className="font-medium text-purple-900">{benefit.title}</h3>
                    </div>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Therapy;
