import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Navigate } from 'react-router-dom';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    components, 
    requests, 
    updateRequest, 
    addComponent,
    updateComponent,
    deleteComponent,
    loading 
  } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [componentForm, setComponentForm] = useState({
    name: '',
    category: '',
    description: '',
    specifications: '',
    total_quantity: 0,
    available_quantity: 0,
    image_url: '',
    location: '',
    low_stock_threshold: 5,
  });

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    {
      icon: Package,
      title: 'Total Components',
      value: components.length,
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      title: 'Pending Requests',
      value: requests.filter(r => r.status === 'pending').length,
      color: 'bg-orange-500',
    },
    {
      icon: CheckCircle,
      title: 'Approved Requests',
      value: requests.filter(r => r.status === 'approved').length,
      color: 'bg-green-500',
    },
    {
      icon: AlertTriangle,
      title: 'Low Stock Items',
      value: components.filter(c => c.available_quantity <= c.low_stock_threshold).length,
      color: 'bg-red-500',
    },
  ];

  const handleApproveRequest = async (requestId: string) => {
    try {
      await updateRequest(requestId, {
        status: 'approved',
        approved_by: user.id,
        approved_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await updateRequest(requestId, {
        status: 'rejected',
        approved_by: user.id,
        approved_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  const handleComponentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const componentData = {
        ...componentForm,
        specifications: componentForm.specifications ? JSON.parse(componentForm.specifications) : {},
      };

      if (editingComponent) {
        await updateComponent(editingComponent, componentData);
        setEditingComponent(null);
      } else {
        await addComponent(componentData);
      }

      setComponentForm({
        name: '',
        category: '',
        description: '',
        specifications: '',
        total_quantity: 0,
        available_quantity: 0,
        image_url: '',
        location: '',
        low_stock_threshold: 5,
      });
      setShowComponentForm(false);
    } catch (error) {
      console.error('Error saving component:', error);
      alert('Failed to save component');
    }
  };

  const handleEditComponent = (component: any) => {
    setComponentForm({
      name: component.name,
      category: component.category,
      description: component.description,
      specifications: JSON.stringify(component.specifications),
      total_quantity: component.total_quantity,
      available_quantity: component.available_quantity,
      image_url: component.image_url || '',
      location: component.location || '',
      low_stock_threshold: component.low_stock_threshold,
    });
    setEditingComponent(component.id);
    setShowComponentForm(true);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'requests', label: 'Requests', icon: Clock },
    { id: 'components', label: 'Components', icon: Package },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Requests */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Requests</h3>
                    <div className="space-y-3">
                      {requests.slice(0, 5).map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              {request.user_profile?.name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {request.component?.name} (Qty: {request.quantity})
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            request.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            request.status === 'approved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Low Stock Alert */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
                    <div className="space-y-3">
                      {components
                        .filter(c => c.available_quantity <= c.low_stock_threshold)
                        .slice(0, 5)
                        .map((component) => (
                        <div key={component.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{component.name}</p>
                            <p className="text-sm text-gray-600">{component.category}</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                            {component.available_quantity} left
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Requests</h3>
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {request.user_profile?.name || 'Unknown User'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {request.user_profile?.email || 'No email'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          request.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          request.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Component:</p>
                        <p className="text-sm text-gray-900">
                          {request.component?.name} (Qty: {request.quantity})
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Purpose:</strong> {request.purpose}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Expected Return:</strong> {format(new Date(request.expected_return_date), 'MMM d, yyyy')}
                      </p>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'components' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Components</h3>
                  <button 
                    onClick={() => setShowComponentForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Component</span>
                  </button>
                </div>

                {showComponentForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-6 mb-6"
                  >
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {editingComponent ? 'Edit Component' : 'Add New Component'}
                    </h4>
                    <form onSubmit={handleComponentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={componentForm.name}
                          onChange={(e) => setComponentForm({ ...componentForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={componentForm.category}
                          onChange={(e) => setComponentForm({ ...componentForm, category: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Quantity</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={componentForm.total_quantity}
                          onChange={(e) => setComponentForm({ ...componentForm, total_quantity: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Quantity</label>
                        <input
                          type="number"
                          required
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={componentForm.available_quantity}
                          onChange={(e) => setComponentForm({ ...componentForm, available_quantity: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={componentForm.location}
                          onChange={(e) => setComponentForm({ ...componentForm, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={componentForm.image_url}
                          onChange={(e) => setComponentForm({ ...componentForm, image_url: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={componentForm.description}
                          onChange={(e) => setComponentForm({ ...componentForm, description: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specifications (JSON)</label>
                        <textarea
                          rows={2}
                          placeholder='{"voltage": "5V", "current": "100mA"}'
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={componentForm.specifications}
                          onChange={(e) => setComponentForm({ ...componentForm, specifications: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 flex space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          {editingComponent ? 'Update Component' : 'Create Component'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowComponentForm(false);
                            setEditingComponent(null);
                            setComponentForm({
                              name: '',
                              category: '',
                              description: '',
                              specifications: '',
                              total_quantity: 0,
                              available_quantity: 0,
                              image_url: '',
                              location: '',
                              low_stock_threshold: 5,
                            });
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Category</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Available</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Total</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {components.map((component) => (
                        <tr key={component.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.category}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.available_quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.total_quantity}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              component.available_quantity > component.low_stock_threshold ? 'bg-green-100 text-green-700' :
                              component.available_quantity > 0 ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {component.available_quantity > component.low_stock_threshold ? 'In Stock' :
                               component.available_quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditComponent(component)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this component?')) {
                                    deleteComponent(component.id);
                                  }
                                }}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;