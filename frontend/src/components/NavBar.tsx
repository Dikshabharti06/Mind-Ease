
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Menu, X, Brain, LogOut, Moon, Clock, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const NavBar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Thought Journal', path: '/journal' },
    { name: 'Mindfulness', path: '/meditation' },
    { name: 'Sleep Tracking', path: '/sleep' },
    { name: 'AI Coach', path: '/chat' },
    { name: 'Support Circle', path: '/community' },
    { name: 'Therapy', path: '/therapy' },
  ];

  const isHomePage = location.pathname === '/';
  
  return (
    <nav className={`w-full py-4 ${isHomePage ? 'bg-transparent absolute top-0 left-0 z-50' : 'bg-white border-b'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-lg flex items-center justify-center mr-2">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${isHomePage ? 'text-gray-800' : 'text-gray-900'}`}>MindEase</span>
            </Link>
          </div>

          {!isMobile && (
            <div className="hidden md:flex items-center space-x-1">
              {isAuthenticated ? (
                <>
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === item.path
                          ? 'text-blue-600 bg-blue-50'
                          : `${isHomePage ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="ml-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                          {user?.name.charAt(0).toUpperCase()}
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/auth"
                    className={`text-sm font-medium ${isHomePage ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                  >
                    Login
                  </Link>
                  <Button asChild>
                    <Link to="/auth?signup=true" className="flex items-center">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}

          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-md focus:outline-none ${
                isHomePage ? 'text-gray-800' : 'text-gray-700'
              }`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {isMobile && mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-gray-200 mt-4 animate-fade-in">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.path
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={toggleMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-3 py-2 mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-3">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium">{user?.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      toggleMobileMenu();
                    }}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/auth"
                  onClick={toggleMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/auth?signup=true"
                  onClick={toggleMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 text-center"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
