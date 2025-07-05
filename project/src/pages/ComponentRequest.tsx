import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, User, FileText, Plus, Minus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const ComponentRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { components, addRequest } = useData();
  const [selectedComponents, setSelectedComponents] = useState<Array<{
    componentId: string;
    componentName: string;
    quantity: number;
    maxQuantity: number;
  }>>([]);
  const [purpose, setPurpose] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const availableComponents = components.filter(c => 
    c.quantity > 0 && (!c.isRestricted || user.role === 'super-admin')
  );

  const handleAddComponent = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    const existingIndex = selectedComponents.findIndex(sc => sc.componentId === componentId);
    if (existingIndex >= 0) {
      // Increase quantity if already selected
      const updated = [...selectedComponents];
      if (updated[existingIndex].quantity < updated[existingIndex].maxQuantity) {
        updated[existingIndex].quantity += 1;
        setSelectedComponents(updated);
      }
    } else {
      // Add new component
      setSelectedComponents([...selectedComponents, {
        componentId,
        componentName: component.name,
        quantity: 1,
        maxQuantity: component.quantity,
      }]);
    }
  };

  const handleRemoveComponent = (componentId: string) => {
    setSelectedComponents(selectedComponents.filter(sc => sc.componentId !== componentId));
  };

  const handleQuantityChange = (componentId: string, delta: number) => {
    const updated = selectedComponents.map(sc => {
      if (sc.componentId === componentId) {
        const newQuantity = sc.quantity + delta;
        if (newQuantity > 0 && newQuantity <= sc.maxQuantity) {
          return { ...sc, quantity: newQuantity };
        }
      }
      return sc;
    });
    setSelectedComponents(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedComponents.length === 0) {
      alert('Please select at least one component');
      return;
    }

    if (!purpose.trim()) {
      alert('Please provide a purpose for your request');
      return;
    }

    if (!expectedReturnDate) {
      alert('Please select an expected return date');
      return;
    }

    const request = {
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      components: selectedComponents,
      purpose: purpose.trim(),
      expectedReturnDate: new Date(expectedReturnDate),
      status: 'pending' as const,
    };

    addRequest(request);
    alert('Request submitted successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Request Components
          </h1>
          <p className="text-lg text-gray-600">
            Select the components you need for your project
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Components */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Components</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableComponents.map((component) => (
                <motion.div
                  key={component.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{component.name}</h3>
                    <p className="text-sm text-gray-600">{component.category}</p>
                    <p className="text-sm text-green-600">Available: {component.quantity}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddComponent(component.id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Request Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={user.name}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>
              </div>

              {/* Selected Components */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Components
                </label>
                <div className="border border-gray-200 rounded-lg p-4 min-h-[100px]">
                  {selectedComponents.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No components selected</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedComponents.map((component) => (
                        <div key={component.componentId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{component.componentName}</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(component.componentId, -1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center">{component.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(component.componentId, 1)}
                              className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors duration-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveComponent(component.componentId)}
                              className="ml-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    id="purpose"
                    rows={4}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Describe the purpose of your request..."
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                  />
                </div>
              </div>

              {/* Expected Return Date */}
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Return Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    id="returnDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Package className="w-5 h-5" />
                <span>Submit Request</span>
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentRequest;