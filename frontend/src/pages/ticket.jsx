import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/check-auth.jsx';
import axios from 'axios';
import { ArrowLeft, User, Clock, AlertCircle, CheckCircle, Brain, Zap } from 'lucide-react';

const Ticket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}`);
      setTicket(response.data.ticket);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (status) => {
    if (!user || !['moderator', 'admin'].includes(user.role)) {
      alert('You do not have permission to update tickets');
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}`, { status });
      setTicket(response.data.ticket);
    } catch (error) {
      console.error('Failed to update ticket:', error);
      alert('Failed to update ticket');
    } finally {
      setUpdating(false);
    }
  };

  const updateTicketPriority = async (priority) => {
    if (!user || user.role !== 'admin') {
      alert('Only admins can update priority');
      return;
    }

    setUpdating(true);
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/tickets/${id}`, { priority });
      setTicket(response.data.ticket);
    } catch (error) {
      console.error('Failed to update priority:', error);
      alert('Failed to update priority');
    } finally {
      setUpdating(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock className="h-5 w-5" />;
      case 'in-progress': return <AlertCircle className="h-5 w-5" />;
      case 'resolved': return <CheckCircle className="h-5 w-5" />;
      case 'closed': return <CheckCircle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Ticket not found</p>
        <button onClick={() => navigate('/tickets')} className="btn-primary mt-4">
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/tickets')}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tickets</span>
        </button>
      </div>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Created by {ticket.user?.name}</span>
              </div>
              <span>•</span>
              <span>{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full border ${getPriorityColor(ticket.priority)}`}>
              <span className="text-sm font-medium">{ticket.priority} priority</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              {getStatusIcon(ticket.status)}
              <span className="capitalize font-medium">{ticket.status}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.assignedTo && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Assigned To</h3>
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">{ticket.assignedTo.name}</p>
                  <p className="text-sm text-gray-500">{ticket.assignedTo.email}</p>
                  {ticket.assignedTo.skills && ticket.assignedTo.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {ticket.assignedTo.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {ticket.aiMetadata && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">AI Analysis</h3>
              </div>
              
              <div className="space-y-4">
                {ticket.aiMetadata.enhancedDescription && (
                  <div>
                    <h4 className="font-medium text-purple-800 mb-2">Enhanced Description</h4>
                    <p className="text-purple-700">{ticket.aiMetadata.enhancedDescription}</p>
                  </div>
                )}

                {ticket.aiMetadata.suggestedSkills && ticket.aiMetadata.suggestedSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-purple-800 mb-2">Suggested Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {ticket.aiMetadata.suggestedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                        >
                          <Zap className="h-3 w-3" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {ticket.aiMetadata.complexityScore && (
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Complexity Score</h4>
                      <p className="text-purple-700">{ticket.aiMetadata.complexityScore}/10</p>
                    </div>
                  )}
                  
                  {ticket.aiMetadata.estimatedResolutionTime && (
                    <div>
                      <h4 className="font-medium text-purple-800 mb-1">Estimated Resolution</h4>
                      <p className="text-purple-700">{ticket.aiMetadata.estimatedResolutionTime}</p>
                    </div>
                  )}
                </div>

                {ticket.aiMetadata.category && (
                  <div>
                    <h4 className="font-medium text-purple-800 mb-1">Category</h4>
                    <p className="text-purple-700 capitalize">{ticket.aiMetadata.category}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {user && ['moderator', 'admin'].includes(user.role) && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              {ticket.status !== 'in-progress' && (
                <button
                  onClick={() => updateTicketStatus('in-progress')}
                  disabled={updating}
                  className="btn-primary disabled:opacity-50"
                >
                  Mark In Progress
                </button>
              )}
              
              {ticket.status !== 'resolved' && (
                <button
                  onClick={() => updateTicketStatus('resolved')}
                  disabled={updating}
                  className="btn-primary disabled:opacity-50"
                >
                  Mark Resolved
                </button>
              )}
              
              {ticket.status !== 'closed' && (
                <button
                  onClick={() => updateTicketStatus('closed')}
                  disabled={updating}
                  className="btn-secondary disabled:opacity-50"
                >
                  Close Ticket
                </button>
              )}
            </div>

            {user.role === 'admin' && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Update Priority</h4>
                <div className="flex gap-2">
                  {['low', 'medium', 'high', 'critical'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => updateTicketPriority(priority)}
                      disabled={updating || ticket.priority === priority}
                      className={`px-3 py-1 rounded text-sm font-medium disabled:opacity-50 ${
                        ticket.priority === priority
                          ? getPriorityColor(priority)
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ticket;