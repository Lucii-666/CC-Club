import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Package, AlertTriangle, Star } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import EditableText from '../components/ui/EditableText';

const Catalog: React.FC = () => {
  const { components, specialComponents } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSpecial, setShowSpecial] = useState(false);

  const allComponents = showSpecial ? specialComponents : components;
  const categories = ['all', ...new Set(allComponents.map(c => c.category))];

  const filteredComponents = allComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Component Catalog
          </h1>
          <p className="text-lg text-gray-600">
            Browse our extensive collection of electronic components
          </p>
        </div>

        {/* Component Type Toggle */}
        <div className="mb-6 flex items-center space-x-4">
          <button
            onClick={() => setShowSpecial(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              !showSpecial 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Regular Components
          </button>
          {(user?.role === 'admin' || user?.role === 'super-admin') && (
            <button
              onClick={() => setShowSpecial(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                showSpecial 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Special Components</span>
            </button>
          )}
        </div>

        {showSpecial && (
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <EditableText
              contentKey="special.title"
              as="h3"
              className="text-lg font-semibold text-purple-900 mb-2"
            />
            <EditableText
              contentKey="special.description"
              as="p"
              className="text-purple-800"
            />
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search components..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                component.isSpecial ? 'ring-2 ring-purple-200' : ''
              }`}
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                <img
                  src={component.imageUrl}
                  alt={component.name}
                  className="w-full h-48 object-cover"
                />
                {component.isSpecial && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>Special</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {component.name}
                  </h3>
                  {component.isRestricted && (
                    <div className="flex items-center space-x-1 text-orange-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs font-medium">Restricted</span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    component.isSpecial 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {component.category}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 text-sm">
                  {component.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Specifications:</span>
                    <span className="text-gray-900">{component.specifications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-900">{component.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Available:</span>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-green-500" />
                      <span className={`font-medium ${component.quantity > 5 ? 'text-green-600' : component.quantity > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                        {component.quantity} units
                      </span>
                    </div>
                  </div>
                </div>

                {user && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {component.isRestricted && user.role !== 'super-admin' ? (
                      <div className="text-center text-orange-600 text-sm font-medium">
                        Super Admin approval required
                      </div>
                    ) : component.isSpecial && user.role === 'student' ? (
                      <div className="text-center text-purple-600 text-sm font-medium">
                        Admin approval required for special components
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                          component.quantity === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : component.isSpecial
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        disabled={component.quantity === 0}
                      >
                        {component.quantity === 0 ? 'Out of Stock' : 'Request Component'}
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;