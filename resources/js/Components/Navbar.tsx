import React, { useEffect, useState } from 'react'

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
  
    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // Show navbar when at top of page
        if (currentScrollY < 10) {
          setIsVisible(true);
        } 
        // Hide navbar when scrolling down, show when scrolling up
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
        
        setLastScrollY(currentScrollY);
      };
  
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);
  
    return (
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="mx-24 mt-4">
          <nav className="bg-white bg-opacity-85 backdrop-blur-md rounded-full px-8 py-4 shadow-lg border border-white border-opacity-20">
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold text-purple-800">
                INDUSTRIAL BUSINESS PROJECT 2025
              </div>
              <div className="flex space-x-8">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  Home
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  About
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  Competition
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200">
                  Timeline
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>
    );
}

export default Navbar
