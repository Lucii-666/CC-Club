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

-// Mock data with real images
-const mockComponents: Component[] = [
-  {
-    id: '1',
-    name: 'Arduino Uno R3',
-    category: 'Microcontrollers',
-    specifications: 'ATmega328P, 14 digital I/O pins, 6 analog inputs',
-    quantity: 15,
-    isRestricted: false,
-    isSpecial: false,
-    imageUrl: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
-    description: 'Popular microcontroller board for beginners',
-    location: 'Shelf A-1',
-  },
-  {
-    id: '2',
-    name: 'Raspberry Pi 4',
-    category: 'Single Board Computers',
-    specifications: '4GB RAM, Quad-core ARM Cortex-A72',
-    quantity: 8,
-    isRestricted: true,
-    isSpecial: false,
-    imageUrl: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
-    description: 'Powerful single-board computer',
-    location: 'Shelf A-2',
-  },
-  {
-    id: '3',
-    name: 'Breadboard (830 points)',
-    category: 'Prototyping',
-    specifications: '830 tie points, 2 power rails',
-    quantity: 25,
-    isRestricted: false,
-    isSpecial: false,
-    imageUrl: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400',
-    description: 'Essential for circuit prototyping',
-    location: 'Shelf B-1',
-  },
-];
-
-const mockSpecialComponents: Component[] = [
-  {
-    id: 'sp1',
-    name: 'FPGA Development Board',
-    category: 'Advanced Microcontrollers',
-    specifications: 'Xilinx Artix-7, 100T FPGA, DDR3 Memory',
-    quantity: 3,
-    isRestricted: true,
-    isSpecial: true,
-    imageUrl: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400',
-    description: 'Advanced FPGA board for complex digital designs',
-    location: 'Special Equipment Room',
-  },
-  {
-    id: 'sp2',
-    name: 'High-Precision Oscilloscope',
-    category: 'Test Equipment',
-    specifications: '500MHz, 4 channels, 5 GSa/s sampling rate',
-    quantity: 1,
-    isRestricted: true,
-    isSpecial: true,
-    imageUrl: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400',
-    description: 'Professional-grade oscilloscope for advanced measurements',
-    location: 'Special Equipment Room',
-  },
-];
-
-const mockProjects: Project[] = [
-  {
-    id: '1',
-    title: 'Smart Home Automation',
-    description: 'Complete home automation system using Arduino and IoT modules with voice control and mobile app integration',
-    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
-    contributors: ['John Doe', 'Jane Smith'],
-    tags: ['IoT', 'Arduino', 'Home Automation'],
-    difficulty: 'intermediate',
-    createdAt: new Date('2023-12-01'),
-    createdBy: '1',
-    status: 'approved',
-    githubUrl: 'https://github.com/example/smart-home',
-    demoUrl: 'https://smarthome-demo.com',
-  },
-  {
-    id: '2',
-    title: 'Line Following Robot',
-    description: 'Autonomous robot that follows a black line using infrared sensors and PID control algorithm',
-    imageUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600',
-    contributors: ['Mike Johnson'],
-    tags: ['Robotics', 'Sensors', 'Arduino'],
-    difficulty: 'beginner',
-    createdAt: new Date('2023-11-15'),
-    createdBy: '2',
-    status: 'approved',
-    githubUrl: 'https://github.com/example/line-robot',
-  },
-];
-
-const mockProjectRequests: ProjectRequest[] = [
-  {
-    id: '1',
-    studentId: '1',
-    studentName: 'John Doe',
-    studentEmail: 'john.doe@marwadiuniversity.ac.in',
-    projectTitle: 'Weather Monitoring Station',
-    projectDescription: 'IoT-based weather station with real-time data logging and web dashboard',
-    projectImageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
-    githubUrl: 'https://github.com/johndoe/weather-station',
-    tags: ['IoT', 'Sensors', 'Data Logging'],
-    difficulty: 'intermediate',
-    status: 'pending',
-    requestDate: new Date('2024-01-20'),
-  },
-];
-
-const mockEvents: Event[] = [
-  {
-    id: '1',
-    title: 'Arduino Workshop for Beginners',
-    description: 'Learn the basics of Arduino programming and build your first LED circuit',
-    date: new Date('2024-02-15'),
-    time: '10:00 AM - 2:00 PM',
-    location: 'Electronics Lab, Room 301',
-    maxParticipants: 30,
-    registeredParticipants: ['1', '2'],
-    imageUrl: 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=600',
-    tags: ['Arduino', 'Workshop', 'Beginner'],
-    createdBy: 'admin',
-    createdAt: new Date('2024-01-10'),
-  },
-  {
-    id: '2',
-    title: 'PCB Design Competition',
-    description: 'Design the most innovative PCB layout and win exciting prizes',
-    date: new Date('2024-02-28'),
-    time: '9:00 AM - 5:00 PM',
-    location: 'Main Auditorium',
-    maxParticipants: 50,
-    registeredParticipants: ['1'],
-    imageUrl: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=600',
-    tags: ['PCB', 'Competition', 'Design'],
-    createdBy: 'admin',
-    createdAt: new Date('2024-01-05'),
-  },
-];
-
 const defaultEditableContent: EditableContent = {
   'hero.title': 'Welcome to Circuitology Club',
   'hero.subtitle': 'Where Innovation Meets Electronics',
@@ -189,7 +49,6 @@ const defaultEditableContent: EditableContent = {
   'contact.title': 'Get in Touch',
   'contact.description': 'Have questions or need help with your project? Our team is here to assist you.',
   'events.title': 'Upcoming Events',
   'events.description': 'Join our exciting workshops, competitions, and showcases to enhance your electronics skills.',
-  'special.title': 'Special Components',
-  'special.description': 'Advanced equipment and components for specialized projects and research.',
 };

 export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
-  const [components, setComponents] = useState<Component[]>(mockComponents);
-  const [specialComponents, setSpecialComponents] = useState<Component[]>(mockSpecialComponents);
-  const [requests, setRequests] = useState<Request[]>([]);
-  const [projects, setProjects] = useState<Project[]>(mockProjects);
-  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>(mockProjectRequests);
-  const [resources] = useState<Resource[]>([]);
-  const [events, setEvents] = useState<Event[]>(mockEvents);
+  const { user } = useAuth();
+  const [components, setComponents] = useState<Component[]>([]);
+  const [requests, setRequests] = useState<ComponentRequest[]>([]);
   const [editableContent, setEditableContent] = useState<EditableContent>(defaultEditableContent);
+  const [loading, setLoading] = useState(true);
+  const [error, setError] = useState<string | null>(null);

+  // Load data from Supabase
   useEffect(() => {
+    loadData();
+    
+    // Load saved content from localStorage
     const savedContent = localStorage.getItem('circuitology_content');
     if (savedContent) {
       setEditableContent(JSON.parse(savedContent));
     }
+  }, [user]);

-    const savedEvents = localStorage.getItem('circuitology_events');
-    if (savedEvents) {
-      setEvents(JSON.parse(savedEvents).map((event: any) => ({
-        ...event,
-        date: new Date(event.date),
-        createdAt: new Date(event.createdAt),
-      })));
+  const loadData = async () => {
+    try {
+      setLoading(true);
+      setError(null);
+      
+      // Load components
+      const { data: componentsData, error: componentsError } = await supabase
+        .from('components')
+        .select('*')
+        .order('name');
+
+      if (componentsError) throw componentsError;
+
+      // Transform components data to match frontend expectations
+      const transformedComponents = componentsData?.map(comp => ({
+        ...comp,
+        quantity: comp.available_quantity,
+        isRestricted: comp.low_stock_threshold > 10, // Example logic
+        isSpecial: comp.category.toLowerCase().includes('advanced') || comp.category.toLowerCase().includes('special'),
+        specifications: typeof comp.specifications === 'string' ? comp.specifications : JSON.stringify(comp.specifications)
+      })) || [];
+
+      setComponents(transformedComponents);
+
+      // Load requests if user is logged in
+      if (user) {
+        const { data: requestsData, error: requestsError } = await supabase
+          .from('component_requests')
+          .select(`
+            *,
+            component:components(*),
+            user:users(name, email)
+          `)
+          .order('created_at', { ascending: false });
+
+        if (requestsError) throw requestsError;
+        setRequests(requestsData || []);
+      }
+    } catch (err) {
+      console.error('Error loading data:', err);
+      setError(err instanceof Error ? err.message : 'Failed to load data');
+    } finally {
+      setLoading(false);
     }
+  };

-    const savedProjects = localStorage.getItem('circuitology_projects');
-    if (savedProjects) {
-      setProjects(JSON.parse(savedProjects).map((project: any) => ({
-        ...project,
-        createdAt: new Date(project.createdAt),
-      })));
-    }
+  const refreshData = () => {
+    loadData();
+  };

-    const savedProjectRequests = localStorage.getItem('circuitology_project_requests');
-    if (savedProjectRequests) {
-      setProjectRequests(JSON.parse(savedProjectRequests).map((request: any) => ({
-        ...request,
-        requestDate: new Date(request.requestDate),
-        reviewedDate: request.reviewedDate ? new Date(request.reviewedDate) : undefined,
-      })));
-    }
+  const updateComponent = async (component: Component) => {
+    try {
+      const { error } = await supabase
+        .from('components')
+        .update({
+          name: component.name,
+          category: component.category,
+          description: component.description,
+          specifications: component.specifications,
+          available_quantity: component.quantity,
+          total_quantity: component.quantity,
+          image_url: component.image_url,
+          location: component.location,
+        })
+        .eq('id', component.id);

-    const savedComponents = localStorage.getItem('circuitology_components');
-    if (savedComponents) {
-      setComponents(JSON.parse(savedComponents));
-    }
+      if (error) throw error;
+      
+      // Update local state
+      setComponents(prev => prev.map(c => c.id === component.id ? component : c));
+    } catch (err) {
+      console.error('Error updating component:', err);
+      throw err;
+    }
+  };

-    const savedSpecialComponents = localStorage.getItem('circuitology_special_components');
-    if (savedSpecialComponents) {
-      setSpecialComponents(JSON.parse(savedSpecialComponents));
+  const addComponent = async (component: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => {
+    try {
+      const { data, error } = await supabase
+        .from('components')
+        .insert({
+          name: component.name,
+          category: component.category,
+          description: component.description,
+          specifications: component.specifications,
+          available_quantity: component.quantity,
+          total_quantity: component.quantity,
+          image_url: component.image_url,
+          location: component.location,
+          created_by: user?.uid,
+        })
+        .select()
+        .single();
+
+      if (error) throw error;
+      
+      if (data) {
+        const newComponent = {
+          ...data,
+          quantity: data.available_quantity,
+          isRestricted: false,
+          isSpecial: false,
+          specifications: typeof data.specifications === 'string' ? data.specifications : JSON.stringify(data.specifications)
+        };
+        setComponents(prev => [...prev, newComponent]);
+      }
+    } catch (err) {
+      console.error('Error adding component:', err);
+      throw err;
     }
-  }, []);
+  };

-  const updateComponent = (component: Component) => {
-    if (component.isSpecial) {
-      const updatedComponents = specialComponents.map(c => c.id === component.id ? component : c);
-      setSpecialComponents(updatedComponents);
-      localStorage.setItem('circuitology_special_components', JSON.stringify(updatedComponents));
-    } else {
-      const updatedComponents = components.map(c => c.id === component.id ? component : c);
-      setComponents(updatedComponents);
-      localStorage.setItem('circuitology_components', JSON.stringify(updatedComponents));
+  const deleteComponent = async (componentId: string) => {
+    try {
+      const { error } = await supabase
+        .from('components')
+        .delete()
+        .eq('id', componentId);
+
+      if (error) throw error;
+      
+      setComponents(prev => prev.filter(c => c.id !== componentId));
+    } catch (err) {
+      console.error('Error deleting component:', err);
+      throw err;
     }
   };

-  const addComponent = (component: Omit<Component, 'id'>) => {
-    const newComponent: Component = {
-      ...component,
-      id: Date.now().toString(),
-    };
+  const addRequest = async (request: Omit<ComponentRequest, 'id' | 'created_at' | 'updated_at' | 'request_date'>) => {
+    try {
+      if (!user) throw new Error('User not logged in');

-    if (component.isSpecial) {
-      const updatedComponents = [...specialComponents, newComponent];
-      setSpecialComponents(updatedComponents);
-      localStorage.setItem('circuitology_special_components', JSON.stringify(updatedComponents));
-    } else {
-      const updatedComponents = [...components, newComponent];
-      setComponents(updatedComponents);
-      localStorage.setItem('circuitology_components', JSON.stringify(updatedComponents));
+      const { data, error } = await supabase
+        .from('component_requests')
+        .insert({
+          user_id: user.uid,
+          component_id: request.component_id,
+          quantity: request.quantity,
+          purpose: request.purpose,
+          expected_return_date: request.expected_return_date,
+        })
+        .select(`
+          *,
+          component:components(*),
+          user:users(name, email)
+        `)
+        .single();
+
+      if (error) throw error;
+      
+      if (data) {
+        setRequests(prev => [data, ...prev]);
+      }
+    } catch (err) {
+      console.error('Error adding request:', err);
+      throw err;
     }
   };

-  const deleteComponent = (componentId: string) => {
-    const regularUpdated = components.filter(c => c.id !== componentId);
-    const specialUpdated = specialComponents.filter(c => c.id !== componentId);
-    
-    setComponents(regularUpdated);
-    setSpecialComponents(specialUpdated);
-    localStorage.setItem('circuitology_components', JSON.stringify(regularUpdated));
-    localStorage.setItem('circuitology_special_components', JSON.stringify(specialUpdated));
-  };
+  const updateRequest = async (request: ComponentRequest) => {
+    try {
+      const { error } = await supabase
+        .from('component_requests')
+        .update({
+          status: request.status,
+          approved_by: request.approved_by,
+          approved_date: request.approved_date,
+          notes: request.notes,
+        })
+        .eq('id', request.id);

-  const addRequest = (request: Omit<Request, 'id' | 'requestDate'>) => {
-    const newRequest: Request = {
-      ...request,
-      id: Date.now().toString(),
-      requestDate: new Date(),
-    };
-    setRequests(prev => [...prev, newRequest]);
-  };
+      if (error) throw error;
+      
+      setRequests(prev => prev.map(r => r.id === request.id ? request : r));
+    } catch (err) {
+      console.error('Error updating request:', err);
+      throw err;
+    }
+  };

-  const updateRequest = (request: Request) => {
-    setRequests(prev => prev.map(r => r.id === request.id ? request : r));
+  const updateEditableContent = (key: string, value: string) => {
+    const newContent = { ...editableContent, [key]: value };
+    setEditableContent(newContent);
+    localStorage.setItem('circuitology_content', JSON.stringify(newContent));
   };

-  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
-    const newProject: Project = {
-      ...project,
-      id: Date.now().toString(),
-      createdAt: new Date(),
-    };
-    const updatedProjects = [...projects, newProject];
-    setProjects(updatedProjects);
-    localStorage.setItem('circuitology_projects', JSON.stringify(updatedProjects));
+  const resetContent = () => {
+    setEditableContent(defaultEditableContent);
+    localStorage.removeItem('circuitology_content');
   };

-  const updateProject = (project: Project) => {
-    const updatedProjects = projects.map(p => p.id === project.id ? project : p);
-    setProjects(updatedProjects);
-    localStorage.setItem('circuitology_projects', JSON.stringify(updatedProjects));
-  };
-
-  const deleteProject = (projectId: string) => {
-    const updatedProjects = projects.filter(p => p.id !== projectId);
-    setProjects(updatedProjects);
-    localStorage.setItem('circuitology_projects', JSON.stringify(updatedProjects));
-  };
-
-  const addProjectRequest = (request: Omit<ProjectRequest, 'id' | 'requestDate'>) => {
-    const newRequest: ProjectRequest = {
-      ...request,
-      id: Date.now().toString(),
-      requestDate: new Date(),
-    };
-    const updatedRequests = [...projectRequests, newRequest];
-    setProjectRequests(updatedRequests);
-    localStorage.setItem('circuitology_project_requests', JSON.stringify(updatedRequests));
-  };
-
-  const updateProjectRequest = (request: ProjectRequest) => {
-    const updatedRequests = projectRequests.map(r => r.id === request.id ? request : r);
-    setProjectRequests(updatedRequests);
-    localStorage.setItem('circuitology_project_requests', JSON.stringify(updatedRequests));
-  };
-
-  const addEvent = (event: Omit<Event, 'id' | 'createdAt'>) => {
-    const newEvent: Event = {
-      ...event,
-      id: Date.now().toString(),
-      createdAt: new Date(),
-    };
-    const updatedEvents = [...events, newEvent];
-    setEvents(updatedEvents);
-    localStorage.setItem('circuitology_events', JSON.stringify(updatedEvents));
-  };
-
-  const updateEvent = (event: Event) => {
-    const updatedEvents = events.map(e => e.id === event.id ? event : e);
-    setEvents(updatedEvents);
-    localStorage.setItem('circuitology_events', JSON.stringify(updatedEvents));
-  };
-
-  const deleteEvent = (eventId: string) => {
-    const updatedEvents = events.filter(e => e.id !== eventId);
-    setEvents(updatedEvents);
-    localStorage.setItem('circuitology_events', JSON.stringify(updatedEvents));
-  };
-
-  const registerForEvent = (eventId: string, userId: string) => {
-    const updatedEvents = events.map(event => {
-      if (event.id === eventId && !event.registeredParticipants.includes(userId)) {
-        return {
-          ...event,
-          registeredParticipants: [...event.registeredParticipants, userId],
-        };
-      }
-      return event;
-    });
-    setEvents(updatedEvents);
-    localStorage.setItem('circuitology_events', JSON.stringify(updatedEvents));
-  };
-
-  const unregisterFromEvent = (eventId: string, userId: string) => {
-    const updatedEvents = events.map(event => {
-      if (event.id === eventId) {
-        return {
-          ...event,
-          registeredParticipants: event.registeredParticipants.filter(id => id !== userId),
-        };
-      }
-      return event;
-    });
-    setEvents(updatedEvents);
-    localStorage.setItem('circuitology_events', JSON.stringify(updatedEvents));
-  };
-
-  const updateEditableContent = (key: string, value: string) => {
-    const newContent = { ...editableContent, [key]: value };
-    setEditableContent(newContent);
-    localStorage.setItem('circuitology_content', JSON.stringify(newContent));
-  };
-
-  const resetContent = () => {
-    setEditableContent(defaultEditableContent);
-    localStorage.removeItem('circuitology_content');
-  };
-
   return (
     <DataContext.Provider value={{
       components,
-      specialComponents,
       requests,
-      projects,
-      projectRequests,
-      resources,
-      events,
       editableContent,
+      loading,
+      error,
       updateComponent,
       addComponent,
       deleteComponent,
       addRequest,
       updateRequest,
-      addProject,
-      updateProject,
-      deleteProject,
-      addProjectRequest,
-      updateProjectRequest,
-      addEvent,
-      updateEvent,
-      deleteEvent,
-      registerForEvent,
-      unregisterFromEvent,
       updateEditableContent,
       resetContent,
+      refreshData,
     }}>
       {children}
     </DataContext.Provider>