import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// Types
interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  specifications: any;
  total_quantity: number;
  available_quantity: number;
  issued_quantity: number;
  damaged_quantity: number;
  image_url: string | null;
  low_stock_threshold: number;
  location: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface ComponentRequest {
  id: string;
  user_id: string;
  component_id: string;
  quantity: number;
  purpose: string;
  expected_return_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'issued' | 'returned';
  request_date: string;
  approved_by: string | null;
  approved_date: string | null;
  issued_date: string | null;
  returned_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  component?: Component;
  user_profile?: {
    name: string;
    email: string;
  };
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string | null;
  image_url: string | null;
  bio: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: string;
  user_id: string | null;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

interface DataContextType {
  components: Component[];
  requests: ComponentRequest[];
  teamMembers: TeamMember[];
  notifications: Notification[];
  loading: boolean;
  
  // Component operations
  fetchComponents: () => Promise<void>;
  addComponent: (component: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateComponent: (id: string, updates: Partial<Component>) => Promise<void>;
  deleteComponent: (id: string) => Promise<void>;
  
  // Request operations
  fetchRequests: () => Promise<void>;
  addRequest: (request: Omit<ComponentRequest, 'id' | 'created_at' | 'updated_at' | 'request_date'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<ComponentRequest>) => Promise<void>;
  
  // Team member operations
  fetchTeamMembers: () => Promise<void>;
  addTeamMember: (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  
  // Notification operations
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [requests, setRequests] = useState<ComponentRequest[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch components
  const fetchComponents = async () => {
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .order('name');

      if (error) throw error;
      setComponents(data || []);
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  // Add component
  const addComponent = async (component: Omit<Component, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('components')
        .insert([{ ...component, created_by: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setComponents(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding component:', error);
      throw error;
    }
  };

  // Update component
  const updateComponent = async (id: string, updates: Partial<Component>) => {
    try {
      const { data, error } = await supabase
        .from('components')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setComponents(prev => prev.map(c => c.id === id ? data : c));
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  };

  // Delete component
  const deleteComponent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('components')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setComponents(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting component:', error);
      throw error;
    }
  };

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('component_requests')
        .select(`
          *,
          component:components(*),
          user_profile:profiles(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  // Add request
  const addRequest = async (request: Omit<ComponentRequest, 'id' | 'created_at' | 'updated_at' | 'request_date'>) => {
    try {
      const { data, error } = await supabase
        .from('component_requests')
        .insert([{ ...request, user_id: user?.id }])
        .select(`
          *,
          component:components(*),
          user_profile:profiles(name, email)
        `)
        .single();

      if (error) throw error;
      setRequests(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding request:', error);
      throw error;
    }
  };

  // Update request
  const updateRequest = async (id: string, updates: Partial<ComponentRequest>) => {
    try {
      const { data, error } = await supabase
        .from('component_requests')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          component:components(*),
          user_profile:profiles(name, email)
        `)
        .single();

      if (error) throw error;
      setRequests(prev => prev.map(r => r.id === id ? data : r));
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  };

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  // Add team member
  const addTeamMember = async (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;
      setTeamMembers(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  };

  // Update team member
  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTeamMembers(prev => prev.map(m => m.id === id ? data : m));
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  };

  // Delete team member
  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Add notification
  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select()
        .single();

      if (error) throw error;
      setNotifications(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchComponents(),
        fetchRequests(),
        fetchTeamMembers(),
        user ? fetchNotifications() : Promise.resolve(),
      ]);
      setLoading(false);
    };

    initializeData();
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    const subscriptions: any[] = [];

    // Subscribe to component changes
    const componentSub = supabase
      .channel('components')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'components' }, () => {
        fetchComponents();
      })
      .subscribe();

    // Subscribe to request changes
    const requestSub = supabase
      .channel('component_requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'component_requests' }, () => {
        fetchRequests();
      })
      .subscribe();

    // Subscribe to team member changes
    const teamSub = supabase
      .channel('team_members')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => {
        fetchTeamMembers();
      })
      .subscribe();

    // Subscribe to notification changes for current user
    if (user) {
      const notificationSub = supabase
        .channel('notifications')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchNotifications();
        })
        .subscribe();
      
      subscriptions.push(notificationSub);
    }

    subscriptions.push(componentSub, requestSub, teamSub);

    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, [user]);

  return (
    <DataContext.Provider value={{
      components,
      requests,
      teamMembers,
      notifications,
      loading,
      fetchComponents,
      addComponent,
      updateComponent,
      deleteComponent,
      fetchRequests,
      addRequest,
      updateRequest,
      fetchTeamMembers,
      addTeamMember,
      updateTeamMember,
      deleteTeamMember,
      fetchNotifications,
      addNotification,
      markNotificationAsRead,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};