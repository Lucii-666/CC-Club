  import React from 'react';
  import { Link } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { ArrowRight, Zap, Users, BookOpen, Wrench, Calendar, MapPin, Clock, UserPlus } from 'lucide-react';
  import CircuitBackground from '../components/ui/CircuitBackground';
  import EditableText from '../components/ui/EditableText';
  import ElectronicsAnimation from '../components/ui/ElectronicsAnimation';
  import { useData } from '../contexts/DataContext';
  import { useAuth } from '../contexts/AuthContext';
  import { format } from 'date-fns';

  const Home: React.FC = () => {
    const { events, registerForEvent, unregisterFromEvent } = useData();
    const { user } = useAuth();

    const features = [
      {
        icon: Zap,
        title: 'Component Library',
        description: 'Access our extensive collection of electronic components for your projects.',
        link: '/catalog',
      },
      {
        icon: BookOpen,
        title: 'Learning Resources',
        description: 'Explore tutorials, guides, and educational materials to enhance your skills.',
        link: '/resources',
      },
      {
        icon: Users,
        title: 'Project Showcase',
        description: 'Discover amazing projects created by our community members.',
        link: '/projects',
      },
      {
        icon: Wrench,
        title: 'Request Components',
        description: 'Easily request components for your projects with our streamlined system.',
        link: '/request',
      },
    ];

    const upcomingEvents = events
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    const handleEventRegistration = (eventId: string) => {
      if (!user) return;
      
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      if (event.registeredParticipants.includes(user.id)) {
        unregisterFromEvent(eventId, user.id);
      } else {
        registerForEvent(eventId, user.id);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <CircuitBackground />
          
          {/* Floating electronics animations */}
          <ElectronicsAnimation type="pulse" className="top-20 left-10" />
          <ElectronicsAnimation type="flow" className="top-40 right-20" />
          <ElectronicsAnimation type="spark" className="bottom-40 left-20" />
          <ElectronicsAnimation type="wave" className="top-60 right-40" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <EditableText
                  contentKey="hero.title"
                  as="h1"
                  className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
                />
                <EditableText
                  contentKey="hero.subtitle"
                  as="h2"
                  className="text-xl md:text-2xl text-blue-600 mb-8 font-medium"
                />
                <EditableText
                  contentKey="hero.description"
                  as="p"
                  className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
                  >
                    Explore Components
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="https://forms.gle/coNT6VsmpfDW8pCU7"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-lg shadow-lg hover:shadow-xl"
                  >
                    Join Our Club
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Innovate
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our comprehensive platform provides all the tools and resources you need to bring your electronics projects to life.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <Link to={feature.link}>
                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                      {/* Animated background effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                      
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-6 relative z-10"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 relative z-10">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed relative z-10">
                        {feature.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-20 bg-gray-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <EditableText
                contentKey="events.title"
                as="h2"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              />
              <EditableText
                contentKey="events.description"
                as="p"
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      {event.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{event.registeredParticipants.length}/{event.maxParticipants} registered</span>
                      </div>
                    </div>

                    {user ? (
                      <motion.button
                        onClick={() => handleEventRegistration(event.id)}
                        disabled={!event.registeredParticipants.includes(user.id) && event.registeredParticipants.length >= event.maxParticipants}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          event.registeredParticipants.includes(user.id)
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : event.registeredParticipants.length >= event.maxParticipants
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>
                          {event.registeredParticipants.includes(user.id)
                            ? 'Unregister'
                            : event.registeredParticipants.length >= event.maxParticipants
                            ? 'Event Full'
                            : 'Register Now'}
                        </span>
                      </motion.button>
                    ) : (
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Login to Register</span>
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {upcomingEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                <p className="text-gray-600">Check back soon for exciting workshops and competitions!</p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <EditableText
                  contentKey="about.title"
                  as="h2"
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                />
                <EditableText
                  contentKey="about.description"
                  as="p"
                  className="text-lg text-gray-600 mb-8 leading-relaxed"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <motion.img
                  src="https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Electronics Workshop"
                  className="rounded-xl shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-green-500/20 rounded-xl"></div>
                
                {/* Floating animation elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-70"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-500 rounded-full opacity-70"
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white relative overflow-hidden">
          {/* Animated background elements */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <EditableText
                contentKey="mission.title"
                as="h2"
                className="text-3xl md:text-4xl font-bold mb-6"
              />
              <EditableText
                contentKey="mission.description"
                as="p"
                className="text-xl leading-relaxed max-w-3xl mx-auto"
              />
            </motion.div>
          </div>
        </section>
      </div>
    );
  };

  export default Home;