import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './app/Header';
import CharacterLibrary from './app/CharacterLibrary';
import CharacterViewer from './app/CharacterViewer';
import AnimationPanel from './app/AnimationPanel';
import { mockCharacters, mockAnimations } from '../data/mockData';

const MainApp = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setSelectedCharacter(mockCharacters[0]);
    }, 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading Mixamo...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="flex h-[calc(100vh-80px)]">
        {/* Character Library - Left Panel */}
        <div className="w-80 bg-gray-800 border-r border-gray-700">
          <CharacterLibrary
            characters={mockCharacters}
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
          />
        </div>

        {/* Character Viewer - Center */}
        <div className="flex-1 bg-gray-900">
          <CharacterViewer
            character={selectedCharacter}
            animation={selectedAnimation}
          />
        </div>

        {/* Animation Panel - Right */}
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <AnimationPanel
            animations={mockAnimations}
            selectedAnimation={selectedAnimation}
            onSelectAnimation={setSelectedAnimation}
            character={selectedCharacter}
          />
        </div>
      </main>
    </div>
  );
};

export default MainApp;