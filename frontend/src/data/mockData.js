export const mockCharacters = [
  {
    id: 1,
    name: "Kaya",
    thumbnail: "https://images.unsplash.com/photo-1594736797933-d0400c80a2e0?w=150&h=150&fit=crop&crop=face",
    type: "Humanoid",
    polygons: "15,482",
    tags: ["female", "casual", "modern"]
  },
  {
    id: 2,
    name: "Malcolm",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    type: "Humanoid",
    polygons: "18,672",
    tags: ["male", "business", "formal"]
  },
  {
    id: 3,
    name: "Remy",
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    type: "Humanoid",
    polygons: "14,235",
    tags: ["female", "athletic", "sports"]
  },
  {
    id: 4,
    name: "Vanguard By T. Choonyung",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    type: "Humanoid",
    polygons: "22,156",
    tags: ["male", "warrior", "armor"]
  },
  {
    id: 5,
    name: "Jasmine",
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    type: "Humanoid",
    polygons: "16,789",
    tags: ["female", "elegant", "dress"]
  },
  {
    id: 6,
    name: "Mutant",
    thumbnail: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=face",
    type: "Creature",
    polygons: "28,421",
    tags: ["creature", "fantasy", "monster"]
  }
];

export const mockAnimations = [
  {
    id: 1,
    name: "Idle",
    category: "Basic",
    duration: "2.5s",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
    description: "Basic idle stance",
    tags: ["basic", "loop", "standing"]
  },
  {
    id: 2,
    name: "Walking",
    category: "Locomotion",
    duration: "1.2s",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop",
    description: "Natural walking cycle",
    tags: ["locomotion", "cycle", "walking"]
  },
  {
    id: 3,
    name: "Running",
    category: "Locomotion",
    duration: "0.8s",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
    description: "Fast running animation",
    tags: ["locomotion", "cycle", "running", "fast"]
  },
  {
    id: 4,
    name: "Jumping",
    category: "Action",
    duration: "1.5s",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=150&h=150&fit=crop",
    description: "Vertical jump with landing",
    tags: ["action", "jump", "landing"]
  },
  {
    id: 5,
    name: "Dancing",
    category: "Entertainment",
    duration: "4.2s",
    thumbnail: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=150&h=150&fit=crop",
    description: "Rhythmic dance moves",
    tags: ["entertainment", "dance", "rhythm"]
  },
  {
    id: 6,
    name: "Waving",
    category: "Gesture",
    duration: "2.0s",
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=150&fit=crop",
    description: "Friendly hand wave",
    tags: ["gesture", "greeting", "wave"]
  },
  {
    id: 7,
    name: "Sitting",
    category: "Basic",
    duration: "3.0s",
    thumbnail: "https://images.unsplash.com/photo-1506629905587-4b33d7af71ed?w=150&h=150&fit=crop",
    description: "Sitting down motion",
    tags: ["basic", "sitting", "rest"]
  },
  {
    id: 8,
    name: "Punching",
    category: "Combat",
    duration: "1.1s",
    thumbnail: "https://images.unsplash.com/photo-1549476464-37392f717541?w=150&h=150&fit=crop",
    description: "Combat punch sequence",
    tags: ["combat", "punch", "fight"]
  },
  {
    id: 9,
    name: "Clapping",
    category: "Gesture",
    duration: "2.3s",
    thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=150&h=150&fit=crop",
    description: "Applause animation",
    tags: ["gesture", "clap", "applause"]
  },
  {
    id: 10,
    name: "Thinking",
    category: "Gesture",
    duration: "3.5s",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    description: "Contemplative thinking pose",
    tags: ["gesture", "thinking", "contemplation"]
  }
];

export const animationCategories = [
  "All",
  "Basic", 
  "Locomotion",
  "Action",
  "Combat",
  "Gesture",
  "Entertainment",
  "Sports",
  "Dance"
];