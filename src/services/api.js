import axios from 'axios';

const api = axios.create({
  baseURL: 'https://livz-backend-user.weaverize.com',
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const fetchEvents = async (token) => {
  const response = await api.get('/users/event-list', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const fetchPhotos = async (eventId, token) => {
  const response = await api.get(`https://livz-backend-media.weaverize.com/media/all-media?eventId=${eventId}&favorites=false&photos=true&videos=false&page=0`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
