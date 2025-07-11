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
  const { components, requests, events, updateRequest, resetContent, addEvent, updateEvent, deleteEvent } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 50,
    imageUrl: '',
    tags: '',
  });

  if (!user || (user.role !== 'admin' && user.role !== 'super-admin')) {
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
      icon: Calendar,
      title: 'Upcoming Events',
      value: events.filter(e => new Date(e.date) >= new Date()).length,
      color: 'bg-purple-500',
    },
  ];

  const handleApproveRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      updateRequest({
        ...request,
        status: 'approved',
        approvedBy: user.name,
        approvedDate: new Date(),
      });
    }
  };

  const handleRejectRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      updateRequest({
        ...request,
        status: 'rejected',
        approvedBy: user.name,
        approvedDate: new Date(),
      });
    }
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      ...eventForm,
      date: new Date(eventForm.date),
      tags: eventForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      registeredParticipants: [],
      createdBy: user.id,
    };

    if (editingEvent) {
      const existingEvent = events.find(e => e.id === editingEvent);
      if (existingEvent) {
        updateEvent({
          ...existingEvent,
          ...eventData,
        });
      }
      setEditingEvent(null);
    } else {
      addEvent(eventData);
    }

    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: 50,
      imageUrl: '',
      tags: '',
    });
    setShowEventForm(false);
  };

  const handleEditEvent = (event: any) => {
    setEventForm({
      title: event.title,
      description: event.description,
      date: format(new Date(event.date), 'yyyy-MM-dd'),
      time: event.time,
      location: event.location,
      maxParticipants: event.maxParticipants,
      imageUrl: event.imageUrl,
      tags: event.tags.join(', '),
    });
    setEditingEvent(event.id);
    setShowEventForm(true);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'requests', label: 'Requests', icon: Clock },
    { id: 'components', label: 'Components', icon: Package },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'content', label: 'Content', icon: Edit },
  ];

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
            {activeTab === 'events' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Events</h3>
                  <motion.button
                    onClick={() => setShowEventForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </motion.button>
                </div>

                {showEventForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-6 mb-6"
                  >
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {editingEvent ? 'Edit Event' : 'Add New Event'}
                    </h4>
                    <form onSubmit={handleEventSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., 10:00 AM - 2:00 PM"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                        <input
                          type="number"
                          required
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={eventForm.maxParticipants}
                          onChange={(e) => setEventForm({ ...eventForm, maxParticipants: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={eventForm.imageUrl}
                          onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={eventForm.description}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g., Arduino, Workshop, Beginner"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={eventForm.tags}
                          onChange={(e) => setEventForm({ ...eventForm, tags: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2 flex space-x-2">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                          {editingEvent ? 'Update Event' : 'Create Event'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowEventForm(false);
                            setEditingEvent(null);
                            setEventForm({
                              title: '',
                              description: '',
                              date: '',
                              time: '',
                              location: '',
                              maxParticipants: 50,
                              imageUrl: '',
                              tags: '',
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

                <div className="space-y-4">
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <UserPlus className="w-4 h-4" />
                              <span>{event.registeredParticipants.length}/{event.maxParticipants}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {event.registeredParticipants.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Registered Participants:</p>
                          <div className="flex flex-wrap gap-2">
                            {event.registeredParticipants.map((participantId, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                User {participantId}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

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
                            <p className="font-medium text-gray-900">{request.studentName}</p>
                            <p className="text-sm text-gray-600">{request.components.length} components</p>
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
                      {components.filter(c => c.quantity <= 5).map((component) => (
                        <div key={component.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{component.name}</p>
                            <p className="text-sm text-gray-600">{component.category}</p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                            {component.quantity} left
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
                          <h4 className="font-medium text-gray-900">{request.studentName}</h4>
                          <p className="text-sm text-gray-600">{request.studentEmail}</p>
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
                        <p className="text-sm text-gray-600 mb-1">Components:</p>
                        <ul className="text-sm text-gray-900">
                          {request.components.map((comp, index) => (
                            <li key={index}>• {comp.componentName} (Qty: {comp.quantity})</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Purpose:</strong> {request.purpose}
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
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Plus className="w-4 h-4" />
                    <span>Add Component</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Category</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Quantity</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {components.map((component) => (
                        <tr key={component.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.category}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{component.quantity}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              component.quantity > 5 ? 'bg-green-100 text-green-700' :
                              component.quantity > 0 ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {component.quantity > 5 ? 'In Stock' :
                               component.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex space-x-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800">
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

            {activeTab === 'content' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Content Management</h3>
                  <button
                    onClick={resetContent}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Reset to Default
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  All content on the website is editable. Visit any page and click the edit icons to modify content in real-time.
                  Changes are automatically saved and will persist until reset.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">How to Edit Content:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Navigate to any page on the website</li>
                    <li>• Look for the edit icons (✏️) that appear when you hover over text</li>
                    <li>• Click the edit icon to modify the content</li>
                    <li>• Your changes are automatically saved</li>
                    <li>• Use the "Reset to Default" button to restore original content</li>
                  </ul>
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