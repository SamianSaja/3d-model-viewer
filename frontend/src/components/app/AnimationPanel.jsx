import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { 
  Search, 
  Play, 
  Download, 
  Settings, 
  Filter,
  Clock,
  Tag,
  Grid3X3,
  List
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { animationCategories } from '../../data/mockData';

const AnimationPanel = ({ animations, selectedAnimation, onSelectAnimation, character }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [animationSpeed, setAnimationSpeed] = useState([1]);
  const [armSpacing, setArmSpacing] = useState([50]);
  const { toast } = useToast();

  const filteredAnimations = animations.filter(animation => {
    const matchesSearch = animation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || animation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAnimationSelect = (animation) => {
    onSelectAnimation(animation);
    toast({
      title: "Animation Selected",
      description: `Applied ${animation.name} to ${character?.name || 'character'}`,
    });
  };

  const handleDownload = () => {
    if (!selectedAnimation || !character) {
      toast({
        title: "Select Animation & Character",
        description: "Please select both a character and animation to download.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download Started",
      description: `Downloading ${character.name} with ${selectedAnimation.name} animation...`,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Animations</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="text-gray-400 hover:text-white p-2"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-2"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search animations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1 mb-4">
          {animationCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`text-xs px-2 py-1 h-auto ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Animation List */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3 p-4">
            {filteredAnimations.map((animation, index) => (
              <motion.div
                key={animation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border transition-all duration-200 ${
                  selectedAnimation?.id === animation.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                }`}
                onClick={() => handleAnimationSelect(animation)}
              >
                {/* Animation Thumbnail */}
                <div className="aspect-square bg-gray-700 overflow-hidden relative">
                  <img
                    src={animation.thumbnail}
                    alt={animation.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button
                      size="sm"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-white/30"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs bg-black/60 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {animation.duration}
                    </Badge>
                  </div>
                </div>

                {/* Animation Info */}
                <div className="p-2">
                  <h4 className="text-sm font-medium text-white truncate mb-1">
                    {animation.name}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                    {animation.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {animation.category}
                    </Badge>
                    {selectedAnimation?.id === animation.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredAnimations.map((animation, index) => (
              <motion.div
                key={animation.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAnimation?.id === animation.id
                    ? 'bg-blue-500/20 border border-blue-500'
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
                onClick={() => handleAnimationSelect(animation)}
              >
                <img
                  src={animation.thumbnail}
                  alt={animation.name}
                  className="w-12 h-12 object-cover rounded mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">{animation.name}</h4>
                    <span className="text-xs text-gray-400">{animation.duration}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{animation.description}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {animation.category}
                    </Badge>
                    {animation.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredAnimations.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-gray-400 mb-2">No animations found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Animation Controls */}
      {selectedAnimation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-700 p-4 bg-gray-800/50"
        >
          <div className="mb-4">
            <h3 className="text-sm font-medium text-white mb-2">Animation Settings</h3>
            
            {/* Speed Control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-400">Speed</label>
                <span className="text-xs text-white">{animationSpeed[0]}x</span>
              </div>
              <Slider
                value={animationSpeed}
                onValueChange={setAnimationSpeed}
                max={3}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Arm Spacing Control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-400">Arm Spacing</label>
                <span className="text-xs text-white">{armSpacing[0]}%</span>
              </div>
              <Slider
                value={armSpacing}
                onValueChange={setArmSpacing}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected Animation Info */}
          <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">{selectedAnimation.name}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>Duration: {selectedAnimation.duration}</div>
              <div>Category: {selectedAnimation.category}</div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{selectedAnimation.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedAnimation.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnimationPanel;