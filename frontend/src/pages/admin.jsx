import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/check-auth.jsx';
import axios from 'axios';
import { Users, Shield, UserCheck, AlertCircle } from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/all`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/users/${userId}/role`, {
        role: newRole
      });
      
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      
      alert('User role updated successfully');
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield className="h-5 w-5 text-red-600" />;
      case 'moderator': return <UserCheck className="h-5 w-5 text-blue-600" />;
      case 'user': return <Users className="h-5 w-5 text-green-600" />;
      default: return <Users className="h-5 w-5 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You need admin privileges to access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-6">User Management</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Current Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Skills</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData) => (
                <tr key={userData._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Users className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{userData.name}</p>
                        <p className="text-sm text-gray-500">
                          Joined {new Date(userData.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <p className="text-gray-900">{userData.email}</p>
                    {userData.isVerified ? (
                      <span className="text-xs text-green-600">Verified</span>
                    ) : (
                      <span className="text-xs text-red-600">Not Verified</span>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(userData.role)}
                      <span className={`px-2 py-1 rounded-full border text-sm font-medium ${getRoleColor(userData.role)}`}>
                        {userData.role}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    {userData.skills && userData.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {userData.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {userData.skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{userData.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No skills listed</span>
                    )}
                  </td>
                  
                  <td className="py-4 px-4">
                    {userData._id !== user.id && (
                      <div className="flex space-x-2">
                        {['user', 'moderator', 'admin'].map((role) => (
                          <button
                            key={role}
                            onClick={() => updateUserRole(userData._id, role)}
                            disabled={updating === userData._id || userData.role === role}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                              userData.role === role
                                ? getRoleColor(role)
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {updating === userData._id ? 'Updating...' : role}
                          </button>
                        ))}
                      </div>
                    )}
                    {userData._id === user.id && (
                      <span className="text-sm text-gray-500">Current User</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'user').length}
              </p>
              <p className="text-gray-600">Users</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <UserCheck className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'moderator').length}
              </p>
              <p className="text-gray-600">Moderators</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
              <p className="text-gray-600">Admins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;