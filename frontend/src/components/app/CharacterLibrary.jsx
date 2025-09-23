import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Upload, Filter, MoreVertical } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const CharacterLibrary = ({ characters, selectedCharacter, onSelectCharacter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const { toast } = useToast();

  const filteredCharacters = characters.filter(char => 
    char.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'All' || char.type === filterType)
  );

  const handleUpload = () => {
    toast({
      title: "Upload Character",
      description: "Upload functionality will be available soon!",
    });
  };

  const characterTypes = ['All', 'Humanoid', 'Creature', 'Robot'];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Characters</h2>
          <Button
            onClick={handleUpload}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {characterTypes.map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterType(type)}
              className={`text-xs ${
                filterType === type 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Character Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredCharacters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedCharacter?.id === character.id
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => onSelectCharacter(character)}
            >
              {/* Character Thumbnail */}
              <div className="aspect-square bg-gray-700 overflow-hidden">
                <img
                  src={character.thumbnail}
                  alt={character.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs font-medium mb-1">{character.polygons} polygons</p>
                    <div className="flex flex-wrap gap-1">
                      {character.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Character Info */}
              <div className="p-3 bg-gray-800">
                <h3 className="text-sm font-medium text-white truncate mb-1">
                  {character.name}
                </h3>
                <p className="text-xs text-gray-400">{character.type}</p>
              </div>

              {/* Selection Indicator */}
              {selectedCharacter?.id === character.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              )}

              {/* More Options */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto bg-black/50 hover:bg-black/70"
              >
                <MoreVertical className="w-3 h-3 text-white" />
              </Button>
            </motion.div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No characters found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterLibrary;