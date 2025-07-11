import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  collection,
  getDocs,
  DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';

type Role = 'student' | 'admin' | 'super-admin';

interface FetchedUser {
  uid: string;
  email: string;
  name: string;
  enrollmentNo: string;
  role: Role;
}

const ManageUsers: React.FC = () => {
  const { user, setRole } = useAuth();
  const [allUsers, setAllUsers] = useState<FetchedUser[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Only super-admin can access
  if (!user || user.role !== 'super-admin') {
    return (
      <div className="text-red-600 text-center p-10 text-lg font-semibold">
        🚫 Access Denied – Only Super Admins can manage users.
      </div>
    );
  }

  // 📥 Fetch users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const users: FetchedUser[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as DocumentData;
      users.push({
        uid: docSnap.id,
        email: data.email || '',
        name: data.name || '',
        enrollmentNo: data.enrollmentNo || '',
        role: data.role || 'student',
      });
    });

    setAllUsers(users);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: Role) => {
    await setRole(uid, newRole);
    setAllUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u))
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">User Role Management</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border p-3">Name</th>
                <th className="border p-3">Email</th>
                <th className="border p-3">Enrollment No</th>
                <th className="border p-3">Current Role</th>
                <th className="border p-3">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.uid} className="border-t">
                  <td className="border p-3">{u.name}</td>
                  <td className="border p-3">{u.email}</td>
                  <td className="border p-3">{u.enrollmentNo}</td>
                  <td className="border p-3 capitalize">{u.role}</td>
                  <td className="border p-3">
                    <select
                      className="p-2 border rounded"
                      value={u.role}
                      onChange={(e) =>
                        handleRoleChange(u.uid, e.target.value as Role)
                      }
                      disabled={u.uid === user.uid} // Prevent self-demotion
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
