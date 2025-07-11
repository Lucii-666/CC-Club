import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Clock, Users, BookOpen } from 'lucide-react';

const Guidelines: React.FC = () => {
  const guidelines = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Always prioritize safety when working with electronic components',
      rules: [
        'Wear safety glasses when soldering or working with hazardous materials',
        'Use proper ESD (Electrostatic Discharge) protection',
        'Never work alone with high-voltage equipment',
        'Keep work area clean and organized',
        'Report any damaged equipment immediately'
      ]
    },
    {
      icon: Clock,
      title: 'Lab Hours & Access',
      description: 'Understand when and how to access the lab facilities',
      rules: [
        'Lab is open Monday-Friday 9:00 AM - 6:00 PM',
        'Saturday access: 10:00 AM - 4:00 PM',
        'Must sign in/out when entering the lab',
        'Maximum 3-hour sessions during peak hours',
        'Book equipment in advance for major projects'
      ]
    },
    {
      icon: Package,
      title: 'Component Handling',
      description: 'Proper procedures for requesting and returning components',
      rules: [
        'Submit requests at least 24 hours in advance',
        'Inspect components before use and report any defects',
        'Return components in original packaging when possible',
        'Clean components before returning if necessary',
        'Lost or damaged components must be reported immediately'
      ]
    },
    {
      icon: Users,
      title: 'Collaboration & Conduct',
      description: 'Guidelines for working with others in the lab',
      rules: [
        'Respect others\' work spaces and projects',
        'Share equipment fairly and return promptly',
        'Help newer members learn proper procedures',
        'Keep noise levels appropriate for concentration',
        'Clean up after yourself and others'
      ]
    },
    {
      icon: BookOpen,
      title: 'Project Documentation',
      description: 'Requirements for documenting your projects',
      rules: [
        'Document all projects with schematics and code',
        'Take photos of completed projects for showcase',
        'Share successful projects with the community',
        'Maintain a project log with progress updates',
        'Submit final reports for major projects'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Procedures',
      description: 'What to do in case of emergencies',
      rules: [
        'Know the location of fire extinguishers and first aid kit',
        'In case of fire, evacuate immediately and call emergency services',
        'For electrical accidents, disconnect power before helping',
        'Report all accidents to lab supervisor immediately',
        'Know emergency contact numbers and procedures'
      ]
    }
  ];

  const policies = [
    {
      title: 'Membership Requirements',
      content: [
        'Must be a registered student at Marwadi University',
        'Complete safety training before accessing equipment',
        'Maintain good academic standing',
        'Attend at least 2 club meetings per semester'
      ]
    },
    {
      title: 'Equipment Usage',
      content: [
        'All equipment must be reserved in advance',
        'Maximum usage time: 3 hours per session',
        'Training required for advanced equipment',
        'Damage or misuse may result in replacement costs'
      ]
    },
    {
      title: 'Project Submission',
      content: [
        'Final projects must be submitted by semester end',
        'Include complete documentation and source code',
        'Present your project to the club if selected',
        'Outstanding projects may be featured in showcase'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Club Guidelines & Policies
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read and follow these guidelines to ensure a safe and productive environment for all members
          </p>
        </div>

        {/* Guidelines */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Safety & Usage Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <guideline.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{guideline.title}</h3>
                    <p className="text-sm text-gray-600">{guideline.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {guideline.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Club Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{policy.title}</h3>
                <ul className="space-y-2">
                  {policy.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Notes</h3>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Violation of these guidelines may result in suspension of lab privileges</li>
                <li>• All incidents must be reported to the lab supervisor immediately</li>
                <li>• Guidelines are subject to change - check for updates regularly</li>
                <li>• Questions about guidelines should be directed to club officers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-red-800">Lab Supervisor</h4>
              <p className="text-sm text-red-700">Dr. Sarah Johnson</p>
              <p className="text-sm text-red-700">Phone: +91 98765 43210</p>
              <p className="text-sm text-red-700">Email: sarah.johnson@marwadiuniversity.ac.in</p>
            </div>
            <div>
              <h4 className="font-medium text-red-800">University Security</h4>
              <p className="text-sm text-red-700">24/7 Security Office</p>
              <p className="text-sm text-red-700">Phone: +91 98765 43200</p>
              <p className="text-sm text-red-700">Emergency: 100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;