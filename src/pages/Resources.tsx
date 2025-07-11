import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, FileText, Download, Filter, Search } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

const Resources: React.FC = () => {
  const { resources } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const types = ['all', 'video', 'document', 'pdf', 'tutorial'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'document': return FileText;
      case 'pdf': return Download;
      case 'tutorial': return BookOpen;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'pdf': return 'bg-purple-100 text-purple-800';
      case 'tutorial': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Learning Resources
          </h1>
          <p className="text-lg text-gray-600">
            Enhance your electronics knowledge with our curated collection of tutorials and guides
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => {
            const TypeIcon = getTypeIcon(resource.type);
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(resource.type)}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(resource.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          +{resource.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    <TypeIcon className="w-4 h-4" />
                    <span>
                      {resource.type === 'video' ? 'Watch Video' :
                       resource.type === 'pdf' ? 'Download PDF' :
                       'View Resource'}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;