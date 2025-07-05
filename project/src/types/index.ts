export interface User {
  id: string;
  name: string;
  email: string;
  enrollmentNo: string;
  role: 'student' | 'admin' | 'super-admin';
  createdAt: Date;
}

export interface Component {
  id: string;
  name: string;
  category: string;
  specifications: string;
  quantity: number;
  isRestricted: boolean;
  isSpecial: boolean;
  imageUrl: string;
  description: string;
  location: string;
}

export interface Request {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  components: {
    componentId: string;
    componentName: string;
    quantity: number;
  }[];
  purpose: string;
  expectedReturnDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  requestDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  contributors: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  createdBy: string;
  status: 'pending' | 'approved' | 'rejected';
  githubUrl?: string;
  demoUrl?: string;
}

export interface ProjectRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  projectTitle: string;
  projectDescription: string;
  projectImageUrl: string;
  githubUrl?: string;
  demoUrl?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
  reviewedBy?: string;
  reviewedDate?: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'pdf' | 'tutorial';
  url: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  maxParticipants: number;
  registeredParticipants: string[];
  imageUrl: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
}

export interface EditableContent {
  [key: string]: string;
}