import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Upload, Download, Settings, User, HelpCircle } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Left Side - Logo */}
      <div className="flex items-center space-x-4">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Ai</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="text-xl font-semibold text-white">mixamo</span>
          </div>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search characters and animations..."
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        <div className="h-6 w-px bg-gray-600"></div>

        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
          <Settings className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
          <HelpCircle className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;