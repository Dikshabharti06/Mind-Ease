
import React from 'react';
import { Brain, Flame, Activity, MessageCircle, Clock, Target, Heart, Zap, RefreshCcw, Sparkles } from 'lucide-react';

const FeaturesCart = () => {
  const features = [
    {
      title: "Thought Management Techniques",
      description: "Proven strategies and practices to break free from overthinking",
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-100"
    },
    {
      title: "Stress Tracking",
      description: "Understand your stress levels and monitor progress over time",
      icon: <Activity className="h-8 w-8 text-teal-600" />,
      color: "bg-teal-100"
    },
    {
      title: "Mindfulness Meditation",
      description: "Guided sessions that help you stay present and centered",
      icon: <Flame className="h-8 w-8 text-orange-600" />,
      color: "bg-orange-100"
    },
    {
      title: "AI Coaching Assistant",
      description: "Get immediate help whenever you're caught in overthinking cycles",
      icon: <MessageCircle className="h-8 w-8 text-purple-600" />,
      color: "bg-purple-100"
    },
    {
      title: "Recharge Pauses",
      description: "Quick breaks and exercises that instantly reduce stress",
      icon: <Clock className="h-8 w-8 text-pink-600" />,
      color: "bg-pink-100"
    },
    {
      title: "Goal-Based Progress",
      description: "Personalized goals for improving mental wellness",
      icon: <Target className="h-8 w-8 text-indigo-600" />,
      color: "bg-indigo-100"
    },
    {
      title: "Mood Reset Tools",
      description: "Immediate interventions to stop negative thought spirals",
      icon: <RefreshCcw className="h-8 w-8 text-green-600" />,
      color: "bg-green-100"
    },
    {
      title: "Community Support",
      description: "Learn from and connect with like-minded individuals",
      icon: <Heart className="h-8 w-8 text-red-600" />,
      color: "bg-red-100"
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Effective Solutions for Overthinking and Stress</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Powerful Tools to Recenter Your Mind
          </h2>
          <p className="text-xl text-gray-700">
            MindEase provides a comprehensive solution for overthinking and stress management by combining research-based methods and cognitive-behavioral approaches.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 sm:p-10 shadow-sm">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 flex justify-center">
                <span>86%</span>
                <Zap className="w-8 h-8 ml-2 text-amber-500" />
              </div>
              <p className="mt-2 text-gray-700">Users reported reduced overthinking</p>
            </div>
            
            <div>
              <div className="text-4xl font-bold text-blue-600 flex justify-center">
                <span>12M+</span>
                <Sparkles className="w-8 h-8 ml-2 text-purple-500" />
              </div>
              <p className="mt-2 text-gray-700">Mindfulness minutes completed</p>
            </div>
            
            <div>
              <div className="text-4xl font-bold text-blue-600 flex justify-center">
                <span>94%</span>
                <Heart className="w-8 h-8 ml-2 text-red-500" />
              </div>
              <p className="mt-2 text-gray-700">Satisfaction rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesCart;
