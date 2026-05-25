import { useState, useEffect } from "react";
import { Moon, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-400 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between">
          
          {/* Branding */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">MindfulSpace</span>
            </div>
            <p className="max-w-xs text-gray-300">
              Your companion on the journey to better mental health and wellbeing.
            </p>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Testimonials", "FAQ"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                {["About", "Team", "Careers", "Contact"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Privacy", "Terms", "Security", "Accessibility"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="hover:text-white transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          
          {/* Dynamic Time */}
          <p className="text-sm text-gray-400">
            {currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}
          </p>

          {/* Copyright */}
          <p className="text-gray-500">© {new Date().getFullYear()} MindfulSpace. All rights reserved.</p>

          {/* Social Media */}
          <div className="flex space-x-5 mt-4 md:mt-0">
            {[{ icon: Twitter, link: "#" }, { icon: Facebook, link: "#" }, { icon: Instagram, link: "#" }, { icon: Linkedin, link: "#" }].map(({ icon: Icon, link }, i) => (
              <a key={i} href={link} className="hover:text-white transition-transform transform hover:scale-110 duration-300">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
