
import { getToken, getAuthHeader } from '@/utils/auth';

const API_URL = 'https://psyco.onrender.com';

// Helper function to log requests
const logRequest = (method: string, endpoint: string, headers: any) => {
  console.log(`API ${method} Request to ${endpoint}`);
  console.log('Request headers:', headers);
  const token = getToken();
  console.log('Current token exists:', !!token);
};

export const api = {
  login: async (credentials: any) => {
    try {
      logRequest('POST', 'auth/login', { 'Content-Type': 'application/json' });
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        const responseText = await response.text();
        console.error('Error response:', responseText);
        
        try {
          // Try to parse as JSON if possible
          const errorData = JSON.parse(responseText);
          return { error: errorData.error || errorData.message || 'Login failed' };
        } catch (e) {
          // Not JSON, return text error
          return { error: 'Login failed: Server error' };
        }
      }
      
      try {
        const data = await response.json();
        console.log('Login successful, token received:', data.token ? 'Yes' : 'No');
        return { data };
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        return { error: 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed. Please try again.' };
    }
  },

  signup: async (userData: any) => {
    try {
      logRequest('POST', 'auth/signup', { 'Content-Type': 'application/json' });
      
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (response.ok && data.token) {
        console.log('Signup successful, token received:', data.token.substring(0, 10) + '...');
      }

      if (!response.ok) {
        return { error: data.message || 'Signup failed' };
      }

      return { data };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: 'Signup failed. Please try again.' };
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem('token');
      return { data: { message: 'Logged out successfully' } };
    } catch (error) {
      console.error('Logout error:', error);
      return { error: 'Logout failed.' };
    }
  },

  getUser: async () => {
    try {
      const headers = getAuthHeader();
      logRequest('GET', 'auth/user', headers);
      
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to get user' };
      }

      return { data };
    } catch (error) {
      console.error('Get user error:', error);
      return { error: 'Failed to get user. Please try again.' };
    }
  },

  createJournalEntry: async (entryData: any) => {
    try {
      const headers = getAuthHeader();
      logRequest('POST', 'journal', headers);
      
      const response = await fetch(`${API_URL}/api/journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(entryData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to create journal entry' };
      }

      return { data };
    } catch (error) {
      console.error('Create journal entry error:', error);
      return { error: 'Failed to create journal entry. Please try again.' };
    }
  },

  getJournalEntries: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await fetch(`${API_URL}/api/journal?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to get journal entries' };
      }

      return { data };
    } catch (error) {
      console.error('Get journal entries error:', error);
      return { error: 'Failed to get journal entries. Please try again.' };
    }
  },

  getJournalEntry: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/journal/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to get journal entry' };
      }

      return { data };
    } catch (error) {
      console.error('Get journal entry error:', error);
      return { error: 'Failed to get journal entry. Please try again.' };
    }
  },

  updateJournalEntry: async (id: string, entryData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/journal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(entryData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to update journal entry' };
      }

      return { data };
    } catch (error) {
      console.error('Update journal entry error:', error);
      return { error: 'Failed to update journal entry. Please try again.' };
    }
  },

  deleteJournalEntry: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/journal/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to delete journal entry' };
      }

      return { data };
    } catch (error) {
      console.error('Delete journal entry error:', error);
      return { error: 'Failed to delete journal entry. Please try again.' };
    }
  },

  getMeditations: async (queryParams = '') => {
    try {
      console.log(`Fetching meditations with params: ${queryParams}`);
      const response = await fetch(`${API_URL}/api/meditation${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      console.log('Meditation API response status:', response.status);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Meditation API error:', data);
        return { error: data.message || 'Failed to get meditations' };
      }

      console.log(`Received ${data.length} meditation videos`);
      return { data };
    } catch (error) {
      console.error('Get meditations error:', error);
      return { error: 'Failed to get meditations. Please try again.' };
    }
  },

  getMoodData: async () => {
    try {
      const response = await fetch(`${API_URL}/api/mood`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to get mood data' };
      }

      return { data };
    } catch (error) {
      console.error('Get mood data error:', error);
      return { error: 'Failed to get mood data. Please try again.' };
    }
  },

  saveMood: async (moodData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(moodData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to save mood' };
      }

      return { data };
    } catch (error) {
      console.error('save mood data error:', error);
      return { error: 'Failed to save mood data. Please try again.' };
    }
  },

  getChatHistory: async () => {
    try {
      console.log('Getting chat history with auth headers:', getAuthHeader());
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      const data = await response.json();
      console.log('Chat history response:', data);
      
      if (!response.ok) {
        return { error: data.message || 'Failed to get chat history' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error getting chat history:', error);
      return { error: 'Failed to get chat history. Please try again.' };
    }
  },

  sendMessage: async (message: string) => {
    try {
      console.log('Sending message with auth headers:', getAuthHeader());
      console.log('Message being sent:', message);
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ message })
      });
      
      console.log('Chat message response status:', response.status);
      const data = await response.json();
      console.log('Chat message response data:', data);
      
      if (!response.ok) {
        console.error('Failed to send message:', data);
        return { error: data.message || 'Failed to send message' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error sending message:', error);
      return { error: 'Failed to send message. Please try again.' };
    }
  },

  createPost: async (postData: any) => {
    try {
      const headers = getAuthHeader();
      console.log('Creating post with full auth headers:', headers);
      const token = getToken();
      console.log('Token being used:', token ? token.substring(0, 15) + '...' : 'No token found');
      
      // Try to get token directly from localStorage
      const directToken = localStorage.getItem('token');
      console.log('Token directly from localStorage:', directToken ? 'exists' : 'not found');
      
      const response = await fetch(`${API_URL}/api/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(postData)
      });
      
      console.log('Create post response status:', response.status);
      const data = await response.json();
      console.log('Create post response data:', data);
      
      if (!response.ok) {
        console.error('Failed to create post:', data);
        return { error: data.error || data.message || 'Failed to create post' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error creating post:', error);
      return { error: 'Failed to create post. Please try again.' };
    }
  },

  getPosts: async (page: number = 1, limit: number = 10, category?: string) => {
    let url = `${API_URL}/api/community?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to get posts' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error getting posts:', error);
      return { error: 'Failed to get posts. Please try again.' };
    }
  },

  getPost: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/community/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to get post' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error getting post:', error);
      return { error: 'Failed to get post. Please try again.' };
    }
  },

  likePost: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/community/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to like post' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error liking post:', error);
      return { error: 'Failed to like post. Please try again.' };
    }
  },

  addComment: async (postId: string, commentData: any) => {
    try {
      const headers = getAuthHeader();
      console.log('Adding comment with auth headers:', headers);
      
      const response = await fetch(`${API_URL}/api/community/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(commentData)
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        console.error('Failed to add comment:', data);
        return { error: data.error || data.message || 'Failed to add comment' };
      }
    
      return { data };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { error: 'Failed to add comment. Please try again.' };
    }
  },

  resetChatHistory: async () => {
    try {
      const response = await fetch(`${API_URL}/api/chat/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to reset chat history' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error resetting chat history:', error);
      return { error: 'Failed to reset chat history. Please try again.' };
    }
  },

  reframeThought: async (thought: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tools/reframe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ thought })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to reframe thought' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error reframing thought:', error);
      return { error: 'Failed to reframing thought. Please try again.' };
    }
  },

  analyzeEmotion: async (text: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tools/analyze-emotion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to analyze emotion' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      return { error: 'Failed to analyze emotion. Please try again.' };
    }
  },

  getDailyChallenges: async () => {
    try {
      const response = await fetch(`${API_URL}/api/tools/challenges`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to get challenges' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error getting challenges:', error);
      return { error: 'Failed to get challenges. Please try again.' };
    }
  },

  completeChallenge: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/tools/challenges/${id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Failed to complete challenge' };
      }
      
      return { data };
    } catch (error) {
      console.error('Error completing challenge:', error);
      return { error: 'Failed to complete challenge. Please try again.' };
    }
  },

  getSleepRecords: async () => {
    try {
      const response = await fetch(`${API_URL}/api/sleep`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to get sleep records' };
      }

      return { data };
    } catch (error) {
      console.error('Get sleep records error:', error);
      return { error: 'Failed to get sleep records. Please try again.' };
    }
  },

  saveSleepRecord: async (sleepData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/sleep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(sleepData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to save sleep record' };
      }

      return { data };
    } catch (error) {
      console.error('Save sleep record error:', error);
      return { error: 'Failed to save sleep record. Please try again.' };
    }
  },

  updateSleepRecord: async (id: string, sleepData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/sleep/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(sleepData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to update sleep record' };
      }

      return { data };
    } catch (error) {
      console.error('Update sleep record error:', error);
      return { error: 'Failed to update sleep record. Please try again.' };
    }
  },

  deleteSleepRecord: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/sleep/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to delete sleep record' };
      }

      return { data };
    } catch (error) {
      console.error('Delete sleep record error:', error);
      return { error: 'Failed to delete sleep record. Please try again.' };
    }
  },

  getTherapists: async (specialty?: string) => {
    try {
      let url = `${API_URL}/api/therapy/therapists`;
      if (specialty) {
        url += `?specialty=${specialty}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to get therapists' };
      }

      return { data };
    } catch (error) {
      console.error('Get therapists error:', error);
      return { error: 'Failed to get therapists. Please try again.' };
    }
  },

  getTherapist: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/therapy/therapists/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to get therapist details' };
      }

      return { data };
    } catch (error) {
      console.error('Get therapist error:', error);
      return { error: 'Failed to get therapist details. Please try again.' };
    }
  },

  bookAppointment: async (appointmentData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/therapy/appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to book appointment' };
      }

      return { data };
    } catch (error) {
      console.error('Book appointment error:', error);
      return { error: 'Failed to book appointment. Please try again.' };
    }
  },

  getAppointments: async () => {
    try {
      const response = await fetch(`${API_URL}/api/therapy/appointments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to get appointments' };
      }

      return { data };
    } catch (error) {
      console.error('Get appointments error:', error);
      return { error: 'Failed to get appointments. Please try again.' };
    }
  },

  updateAppointment: async (id: string, appointmentData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/therapy/appointment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to update appointment' };
      }

      return { data };
    } catch (error) {
      console.error('Update appointment error:', error);
      return { error: 'Failed to update appointment. Please try again.' };
    }
  },

  cancelAppointment: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/therapy/appointment/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Failed to cancel appointment' };
      }

      return { data };
    } catch (error) {
      console.error('Cancel appointment error:', error);
      return { error: 'Failed to cancel appointment. Please try again.' };
    }
  },
};
