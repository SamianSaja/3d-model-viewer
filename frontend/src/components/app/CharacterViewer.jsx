import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { RotateCcw, Maximize, Play, Pause, Square } from 'lucide-react';

// Animated 3D Character Component
function AnimatedCharacter({ character, animation, isPlaying = false }) {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current && isPlaying) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef} position={[0, -2, 0]}>
        {/* Main Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.6, 2.5, 8]} />
          <meshStandardMaterial 
            color={character?.name === 'Kaya' ? '#FF6B9D' : 
                   character?.name === 'Malcolm' ? '#4ECDC4' : 
                   character?.name === 'Remy' ? '#45B7D1' : 
                   character?.name === 'Vanguard By T. Choonyung' ? '#96CEB4' : 
                   character?.name === 'Jasmine' ? '#FECA57' : '#FF9F43'} 
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 2, 0]} castShadow>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshStandardMaterial 
            color="#FDBCB4" 
            roughness={0.4}
            metalness={0.0}
          />
          
          {/* Eyes */}
          <mesh position={[-0.2, 0.2, 0.5]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0.2, 0.2, 0.5]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </mesh>

        {/* Arms */}
        <mesh position={[-1.2, 0.5, 0]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 2, 8]} />
          <meshStandardMaterial 
            color={character?.name === 'Kaya' ? '#FF6B9D' : 
                   character?.name === 'Malcolm' ? '#4ECDC4' : 
                   character?.name === 'Remy' ? '#45B7D1' : 
                   character?.name === 'Vanguard By T. Choonyung' ? '#96CEB4' : 
                   character?.name === 'Jasmine' ? '#FECA57' : '#FF9F43'} 
          />
        </mesh>
        <mesh position={[1.2, 0.5, 0]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 2, 8]} />
          <meshStandardMaterial 
            color={character?.name === 'Kaya' ? '#FF6B9D' : 
                   character?.name === 'Malcolm' ? '#4ECDC4' : 
                   character?.name === 'Remy' ? '#45B7D1' : 
                   character?.name === 'Vanguard By T. Choonyung' ? '#96CEB4' : 
                   character?.name === 'Jasmine' ? '#FECA57' : '#FF9F43'} 
          />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.3, -2.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
          <meshStandardMaterial 
            color={character?.name === 'Kaya' ? '#FF6B9D' : 
                   character?.name === 'Malcolm' ? '#4ECDC4' : 
                   character?.name === 'Remy' ? '#45B7D1' : 
                   character?.name === 'Vanguard By T. Choonyung' ? '#96CEB4' : 
                   character?.name === 'Jasmine' ? '#FECA57' : '#FF9F43'} 
          />
          
          {/* Feet */}
          <mesh position={[0, -1.3, 0.4]} castShadow>
            <boxGeometry args={[0.5, 0.3, 1]} />
            <meshStandardMaterial color="#2C3E50" />
          </mesh>
        </mesh>
        <mesh position={[0.3, -2.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
          <meshStandardMaterial 
            color={character?.name === 'Kaya' ? '#FF6B9D' : 
                   character?.name === 'Malcolm' ? '#4ECDC4' : 
                   character?.name === 'Remy' ? '#45B7D1' : 
                   character?.name === 'Vanguard By T. Choonyung' ? '#96CEB4' : 
                   character?.name === 'Jasmine' ? '#FECA57' : '#FF9F43'} 
          />
          
          {/* Feet */}
          <mesh position={[0, -1.3, 0.4]} castShadow>
            <boxGeometry args={[0.5, 0.3, 1]} />
            <meshStandardMaterial color="#2C3E50" />
          </mesh>
        </mesh>
      </group>
    </Float>
  );
}

const CharacterViewer = ({ character, animation }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [cameraReset, setCameraReset] = React.useState(0);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
  };

  const handleResetCamera = () => {
    setCameraReset(prev => prev + 1);
  };

  if (!character) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-lg mb-4 mx-auto flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-600 rounded"></div>
          </div>
          <p className="text-gray-400">Select a character to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-gradient-to-b from-gray-900 to-gray-800">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [5, 3, 8], fov: 45 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize={2048}
          />
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#4A90E2" />
          <pointLight position={[5, 5, -5]} intensity={0.5} color="#F5A623" />

          {/* Environment */}
          <Environment preset="studio" />

          {/* Character */}
          <AnimatedCharacter 
            character={character} 
            animation={animation}
            isPlaying={isPlaying}
          />

          {/* Ground Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>

          {/* Contact Shadows */}
          <ContactShadows 
            position={[0, -4.4, 0]} 
            opacity={0.5} 
            scale={10} 
            blur={2} 
          />

          {/* Camera Controls */}
          <OrbitControls 
            key={cameraReset}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>

      {/* Character Info Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white"
      >
        <h3 className="text-lg font-semibold mb-2">{character.name}</h3>
        <div className="space-y-1 text-sm text-gray-300">
          <p>Type: {character.type}</p>
          <p>Polygons: {character.polygons}</p>
          {animation && (
            <p>Animation: {animation.name} ({animation.duration})</p>
          )}
        </div>
      </motion.div>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-lg p-3">
        <Button
          onClick={handlePlayPause}
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <Button
          onClick={handleStop}
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <Square className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-500 mx-2"></div>

        <Button
          onClick={handleResetCamera}
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <Maximize className="w-4 h-4" />
        </Button>
      </div>

      {/* Animation Timeline (if animation selected) */}
      {animation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white min-w-48"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{animation.name}</span>
            <span className="text-xs text-gray-400">{animation.duration}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              animate={{ 
                width: isPlaying ? "100%" : "0%" 
              }}
              transition={{ 
                duration: parseFloat(animation.duration),
                repeat: isPlaying ? Infinity : 0,
                ease: "linear"
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CharacterViewer;