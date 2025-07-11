import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User, MessageCircle } from 'lucide-react';
import EditableText from '../components/ui/EditableText';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // ensure path is correct


const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await addDoc(collection(db, 'messages'), {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      timestamp: serverTimestamp(),
    });

    console.log('Message sent successfully');
    alert('Message sent!');

    // Reset form after successful submission
    setFormData({ name: '', email: '', subject: '', message: '' });
  } catch (error) {
    console.error('Error sending message:', error);
    alert('Failed to send message.');
  }
};


  const teamMembers = [
    {
      name: 'Prof. Vijay Dubey',
      role: 'Club Co-Ordinator',
      email: 'vijay.dubey@marwadieducation.edu.in',
      phone: '+91 97232 65278',
      image: '/Images/Sir.jpeg'
    },
        {
      name: 'Angel Oza',
      role: 'Convener',
      email: 'angeloza.123042@marwadiuniversity.ac.in',
      phone: '+91 99788 44231',
      image: '/Images/ANGEL.png'
    },
    {
      name: 'Ashutosh Kumar Singh',
      role: 'Deputy Convener',
      email: 'ashutoshkumarsingh.120815@marwadiuniversity.ac.in',
      phone: '+91 90816 96945',
      image: '/Images/Ashutosh.jpeg'
    },
    {
      name: 'Rishi Sampat',
      role: 'General Secretary',
      email: 'rishi.sampat131574@marwadiuniversity.ac.in',
      phone: '+91 91041 10042',
      image: '/Images/Rishi.jpeg'
    },
     {
      name: 'Ruhaan Pathan',
      role: 'Event Coordinator',
      email: 'ruhaan.pathan132253@marwadiuniversity.ac.in',
      phone: '+91 63533 34811',
      image: '/Images/Ruhaan.jpg'
    },
    {
      name: 'Dhwani Desai',
      role: 'Tech Lead',
      email: 'dhwani.desai130930@marwadiuniversity.ac.in',
      phone: '+91 70165 14210',
      image: '/Images/Dhwani.jpeg'
    },
   {
      name: 'Diva Parekh',
      role: 'Content Manager',
      email: 'diva.parekh131119@marwadiuniversity.ac.in',
      phone: '+91 98765 43213',
      image: '/Images/Diva.jpeg'
    },
  ];
const leader = teamMembers[0];            // First member: Prof. Vijay Dubey
const otherMembers = teamMembers.slice(1); // Rest of the members

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <EditableText
            contentKey="contact.title"
            as="h1"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          />
          <EditableText
            contentKey="contact.description"
            as="p"
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                    placeholder="Your message here..."
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">circuitologyclub.mu@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">+91 90816 96945</p>
                    <p className="text-gray-600">+91 63533 34811</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Location</h3>
                    <p className="text-gray-600">MA 108, Marwadi University, Rajkot, Gujarat</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lab Hours */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lab Hours</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-gray-900">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team Members */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
         <div className="grid grid-cols-1 place-items-center mb-12">
          <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-sm">
    <img src={leader.image} alt={leader.name} className="w-full h-64 object-cover" />
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{leader.name}</h3>
      <p className="text-blue-600 font-medium mb-4">{leader.role}</p>
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{leader.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{leader.phone}</span>
        </div>
      </div>
    </div>
  </motion.div>
</div>



          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {otherMembers.map((member, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-blue-600 font-medium mb-4">{member.role}</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{member.phone}</span>
          </div>
        </div>
      </div>
    </motion.div>
  ))}
</div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
