
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Shield, Sparkles, Target, ThumbsUp } from 'lucide-react';
import AOS from 'aos';
import "aos/dist/aos.css";

const HeroSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100 opacity-50"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-purple-100 opacity-40"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-teal-100 opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="md:w-1/2 z-10" data-aos="fade-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>MindEase: The Path to Freedom from Overthinking</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Take Control of Your <span className="text-blue-600">Thoughts</span>, Reclaim Your Mental Peace
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 max-w-2xl">
              MindEase helps you break free from the cycle of overthinking, stress, and anxiety. Reclaim your mental peace with proven techniques, personalized tools, and AI assistance.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                <Link to="/auth">Get Started <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg">
                <a href="#features">Learn More</a>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-10 flex items-center text-sm text-gray-500">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-r from-blue-${i*100} to-purple-${i*100}`}></div>
                ))}
              </div>
              <p>2,000+ people have reclaimed their mental peace</p>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="md:w-1/2 mt-12 md:mt-0 z-10" data-aos="fade-left" data-aos-delay="200">
            <div className="relative">
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl opacity-50 blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80" 
                alt="Calm person practicing mindfulness" 
                className="relative z-10 rounded-2xl shadow-xl max-w-full mx-auto transition-transform hover:scale-105 duration-500"
              />
              
              {/* Feature Highlights */}
              <div className="absolute -left-5 top-1/4 bg-white p-3 rounded-xl shadow-lg flex items-center space-x-3 animate-float">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Mindfulness Techniques</p>
                  <p className="text-xs text-gray-500">10 minutes daily</p>
                </div>
              </div>
              
              <div className="absolute -right-5 bottom-1/4 bg-white p-3 rounded-xl shadow-lg flex items-center space-x-3 animate-float delay-300">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <ThumbsUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Mental State</p>
                  <p className="text-xs text-gray-500">74% improved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
