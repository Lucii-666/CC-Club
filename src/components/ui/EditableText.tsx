import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface EditableTextProps {
  contentKey: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  placeholder?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  contentKey,
  as: Component = 'p',
  className = '',
  placeholder = 'Click to edit...',
}) => {
  const { user } = useAuth();
  const { editableContent, updateEditableContent } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const canEdit = user && (user.role === 'admin' || user.role === 'super-admin');
  const content = editableContent[contentKey] || placeholder;

  const handleEdit = () => {
    if (!canEdit) return;
    setEditValue(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateEditableContent(contentKey, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue('');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="relative group">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className={`w-full min-h-[100px] p-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none ${className}`}
          autoFocus
        />
        <div className="flex space-x-2 mt-2">
          <motion.button
            onClick={handleSave}
            className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </motion.button>
          <motion.button
            onClick={handleCancel}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Component className={`${className} ${canEdit ? 'cursor-pointer' : ''}`} onClick={handleEdit}>
        {content}
      </Component>
      {canEdit && (
        <motion.button
          onClick={handleEdit}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Edit2 className="w-3 h-3" />
        </motion.button>
      )}
    </div>
  );
};

export default EditableText;