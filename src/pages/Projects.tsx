import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Tag, ExternalLink, Filter, Plus, Github, Globe } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const Projects: React.FC = () => {
  const { projects, addProjectRequest } = useData();
  const { user } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    demoUrl: '',
    tags: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  });

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const allTags = ['all', ...new Set(projects.flatMap(p => p.tags))];

  const approvedProjects = projects.filter(p => p.status === 'approved');
  const filteredProjects = approvedProjects.filter(project => {
    const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;
    const matchesTag = selectedTag === 'all' || project.tags.includes(selectedTag);
    return matchesDifficulty && matchesTag;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const projectRequest = {
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      projectTitle: projectForm.title,
      projectDescription: projectForm.description,
      projectImageUrl: projectForm.imageUrl,
      githubUrl: projectForm.githubUrl,
      demoUrl: projectForm.demoUrl,
      tags: projectForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      difficulty: projectForm.difficulty,
      status: 'pending' as const,
    };

    addProjectRequest(projectRequest);
    
    setProjectForm({
      title: '',
      description: '',
      imageUrl: '',
      githubUrl: '',
      demoUrl: '',
      tags: '',
      difficulty: 'beginner',
    });
    setShowRequestForm(false);
    
    alert('Project submission request sent! Admins will review it soon.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Project Showcase
              </h1>
              <p className="text-lg text-gray-600">
                Explore amazing projects created by our community members
              </p>
            </div>
            {user && (
              <motion.button
                onClick={() => setShowRequestForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span>Submit Project</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Project Submission Form */}
        {showRequestForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Project</h3>
            <form onSubmit={handleProjectSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={projectForm.difficulty}
                  onChange={(e) => setProjectForm({ ...projectForm, difficulty: e.target.value as any })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={projectForm.imageUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL (optional)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={projectForm.githubUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Demo URL (optional)</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={projectForm.demoUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., Arduino, IoT, Sensors"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
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
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? 'All Tags' : tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {project.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{project.contributors.length} contributors</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                        +{project.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Contributors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.contributors.map((contributor, contributorIndex) => (
                      <span
                        key={contributorIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {contributor}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </motion.a>
                  )}
                  {project.demoUrl && (
                    <motion.a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Globe className="w-4 h-4" />
                      <span>Demo</span>
                    </motion.a>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm flex-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Details</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filter criteria or submit your own project!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;