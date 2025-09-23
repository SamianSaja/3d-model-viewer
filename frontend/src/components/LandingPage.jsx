import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float } from '@react-three/drei';
import LoginModal from './auth/LoginModal';
import { useAuth } from '../contexts/AuthContext';

// Simple 3D Character Component
function Character3D() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh position={[0, -1, 0]} rotation={[0, 0, 0]}>
        {/* Body */}
        <cylinderGeometry args={[0.8, 0.6, 2, 8]} />
        <meshStandardMaterial color="#FFD700" />
        
        {/* Head */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#FFB347" />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-1.2, 0.5, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        <mesh position={[1.2, 0.5, 0]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.2, 0.2, 1.5, 8]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
        
        {/* Legs */}
        <mesh position={[-0.3, -2.2, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 1.8, 8]} />
          <meshStandardMaterial color="#FFD700" />
          
          {/* Shoes */}
          <mesh position={[0, -1.2, 0.3]}>
            <boxGeometry args={[0.4, 0.2, 0.8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </mesh>
        <mesh position={[0.3, -2.2, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 1.8, 8]} />
          <meshStandardMaterial color="#FFD700" />
          
          {/* Shoes */}
          <mesh position={[0, -1.2, 0.3]}>
            <boxGeometry args={[0.4, 0.2, 0.8]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </mesh>
      </mesh>
    </Float>
  );
}

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Ai</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="text-xl font-semibold">mixamo</span>
          </div>
          <nav className="flex items-center space-x-8 ml-12">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Characters</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Animations</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white"
            onClick={() => navigate('/app')}
          >
            Log in
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/app')}
          >
            Sign up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-lg font-medium mb-4 block">Mixamo</span>
            <h1 className="text-7xl font-bold mb-6 leading-tight">
              Get animated.
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Animate 3D characters for games, film, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center space-x-6"
          >
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg"
              onClick={() => navigate('/app')}
            >
              Sign Up for Free
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg rounded-lg"
              onClick={() => navigate('/app')}
            >
              Log In
            </Button>
          </motion.div>
        </div>

        {/* 3D Character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-0 right-1/4 w-96 h-96"
        >
          <Canvas camera={{ position: [3, 2, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[0, 10, 0]} angle={0.3} intensity={1} />
            <Character3D />
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={2}
            />
          </Canvas>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-400">
        <p>&copy; 2024 Adobe Systems Incorporated. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;