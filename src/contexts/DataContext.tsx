@@ .. @@
 import React, { createContext, useContext, useEffect, useState } from 'react';
-import { Component, Request, Project, ProjectRequest, Resource, Event, EditableContent } from '../types';
+import { supabase } from '../lib/supabase';
+import { useAuth } from './AuthContext';
+import type { Database } from '../types/database';

+// Updated types to match database schema
+type Component = Database['public']['Tables']['components']['Row'] & {
+  isRestricted?: boolean;
+  isSpecial?: boolean;
+  quantity: number; // alias for available_quantity
+};

+type ComponentRequest = Database['public']['Tables']['component_requests']['Row'] & {
+  component?: Component;
+  user?: { name: string; email: string };
+};

+type EditableContent = { [key: string]: string };

 interface DataContextType {
   components: Component[];
-  specialComponents: Component[];
-  requests: Request[];
-  projects: Project[];
-  projectRequests: ProjectRequest[];
-  resources: Resource[];
-  events: Event[];
+  requests: ComponentRequest[];
   editableContent: EditableContent;
+  loading: boolean;
+  error: string | null;
   updateComponent: (component: Component) => void;
-  addComponent: (component: Omit<Component, 'id'>) => void;
+  addComponent: (component: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => void;
   deleteComponent: (componentId: string) => void;
-  addRequest: (request: Omit<Request, 'id' | 'requestDate'>) => void;
-  updateRequest: (request: Request) => void;
-  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
-  updateProject: (project: Project) => void;
-  deleteProject: (projectId: string) => void;
-  addProjectRequest: (request: Omit<ProjectRequest, 'id' | 'requestDate'>) => void;
-  updateProjectRequest: (request: ProjectRequest) => void;
-  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
-  updateEvent: (event: Event) => void;
-  deleteEvent: (eventId: string) => void;
-  registerForEvent: (eventId: string, userId: string) => void;
-  unregisterFromEvent: (eventId: string, userId: string) => void;
+  addRequest: (request: Omit<ComponentRequest, 'id' | 'created_at' | 'updated_at' | 'request_date'>) => void;
+  updateRequest: (request: ComponentRequest) => void;
   updateEditableContent: (key: string, value: string) => void;
   resetContent: () => void;
+  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultEditableContent: EditableContent = {
  'hero.title': 'Welcome to Circuitology Club',
  'hero.subtitle': 'Where Innovation Meets Electronics',
  'about.title': 'About Us',
  'about.description': 'We are a community of electronics enthusiasts dedicated to learning and innovation.',
  'contact.title': 'Get in Touch',
  'contact.description': 'Have questions or need help with your project? Our team is here to assist you.',
  'events.title': 'Upcoming Events',
  'events.description': 'Join our exciting workshops, competitions, and showcases to enhance your electronics skills.',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [requests, setRequests] = useState<ComponentRequest[]>([]);
  const [editableContent, setEditableContent] = useState<EditableContent>(defaultEditableContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    
    const savedContent = localStorage.getItem('circuitology_content');
    if (savedContent) {
      setEditableContent(JSON.parse(savedContent));
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: componentsData, error: componentsError } = await supabase
        .from('components')
        .select('*')
        .order('name');

      if (componentsError) throw componentsError;

      const transformedComponents = componentsData?.map(comp => ({
        ...comp,
        quantity: comp.available_quantity,
        isRestricted: comp.low_stock_threshold > 10,
        isSpecial: comp.category.toLowerCase().includes('advanced') || comp.category.toLowerCase().includes('special'),
        specifications: typeof comp.specifications === 'string' ? comp.specifications : JSON.stringify(comp.specifications)
      })) || [];

      setComponents(transformedComponents);

      if (user) {
        const { data: requestsData, error: requestsError } = await supabase
          .from('component_requests')
          .select(`
            *,
            component:components(*),
            user:users(name, email)
          `)
          .order('created_at', { ascending: false });

        if (requestsError) throw requestsError;
        setRequests(requestsData || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  const updateComponent = async (component: Component) => {
    try {
      const { error } = await supabase
        .from('components')
        .update({
          name: component.name,
          category: component.category,
          description: component.description,
          specifications: component.specifications,
          available_quantity: component.quantity,
          total_quantity: component.quantity,
          image_url: component.image_url,
          location: component.location,
        })
        .eq('id', component.id);

      if (error) throw error;
      
      setComponents(prev => prev.map(c => c.id === component.id ? component : c));
    } catch (err) {
      console.error('Error updating component:', err);
      throw err;
    }
  };

  const addComponent = async (component: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('components')
        .insert({
          name: component.name,
          category: component.category,
          description: component.description,
          specifications: component.specifications,
          available_quantity: component.quantity,
          total_quantity: component.quantity,
          image_url: component.image_url,
          location: component.location,
          created_by: user?.uid,
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        const newComponent = {
          ...data,
          quantity: data.available_quantity,
          isRestricted: false,
          isSpecial: false,
          specifications: typeof data.specifications === 'string' ? data.specifications : JSON.stringify(data.specifications)
        };
        setComponents(prev => [...prev, newComponent]);
      }
    } catch (err) {
      console.error('Error adding component:', err);
      throw err;
    }
  };

  const deleteComponent = async (componentId: string) => {
    try {
      const { error } = await supabase
        .from('components')
        .delete()
        .eq('id', componentId);

      if (error) throw error;
      
      setComponents(prev => prev.filter(c => c.id !== componentId));
    } catch (err) {
      console.error('Error deleting component:', err);
      throw err;
    }
  };

  const addRequest = async (request: Omit<ComponentRequest, 'id' | 'created_at' | 'updated_at' | 'request_date'>) => {
    try {
      if (!user) throw new Error('User not logged in');

      const { data, error } = await supabase
        .from('component_requests')
        .insert({
          user_id: user.uid,
          component_id: request.component_id,
          quantity: request.quantity,
          purpose: request.purpose,
          expected_return_date: request.expected_return_date,
        })
        .select(`
          *,
          component:components(*),
          user:users(name, email)
        `)
        .single();

      if (error) throw error;
      
      if (data) {
        setRequests(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error('Error adding request:', err);
      throw err;
    }
  };

  const updateRequest = async (request: ComponentRequest) => {
    try {
      const { error } = await supabase
        .from('component_requests')
        .update({
          status: request.status,
          approved_by: request.approved_by,
          approved_date: request.approved_date,
          notes: request.notes,
        })
        .eq('id', request.id);

      if (error) throw error;
      
      setRequests(prev => prev.map(r => r.id === request.id ? request : r));
    } catch (err) {
      console.error('Error updating request:', err);
      throw err;
    }
  };

  const updateEditableContent = (key: string, value: string) => {
    const newContent = { ...editableContent, [key]: value };
    setEditableContent(newContent);
    localStorage.setItem('circuitology_content', JSON.stringify(newContent));
  };

  const resetContent = () => {
    setEditableContent(defaultEditableContent);
    localStorage.removeItem('circuitology_content');
  };

  return (
    <DataContext.Provider value={{
      components,
      requests,
      editableContent,
      loading,
      error,
      updateComponent,
      addComponent,
      deleteComponent,
      addRequest,
      updateRequest,
      updateEditableContent,
      resetContent,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
};