import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import UserProfile from '../components/UserProfile'; // Chemin correct vers UserProfile

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events with token:', authToken);
        const response = await axios.get('https://livz-backend-user.weaverize.com/users/event-list', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        console.log('Events fetched:', response.data);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [authToken]);

  // Séparer les événements en ouverts et fermés
  const openEvents = events.filter(event => event.eventData.ongoing);
  const closedEvents = events.filter(event => !event.eventData.ongoing);

  // Trier les événements ouverts et fermés par date de début
  openEvents.sort((a, b) => new Date(a.eventData.dateStart) - new Date(b.eventData.dateStart));
  closedEvents.sort((a, b) => new Date(a.eventData.dateStart) - new Date(b.eventData.dateStart));

  const handleEventClick = (eventId) => {
    console.log('Event clicked:', eventId);
    navigate(`/events/${eventId}/photos`);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <ClipLoader color="#007bff" loading={loading} size={150} />
      </div>
    );
  }

  return (
    <div className="main-container">
      <UserProfile /> {/* Ajouter le composant UserProfile */}
      <div className="container">
        <h1>Liste des événements</h1>
        <div className="event-list">
          {openEvents.length > 0 && (
            <>
              <h2>Événements ouverts</h2>
              {openEvents.map(event => (
                <div className="event-item" key={event.eventData.eventCode}>
                  <img src={event.eventData.coverUrl} alt={event.eventData.name} className="event-thumbnail" />
                  <div className="event-info">
                    <span className="event-status open">Ouvert</span>
                    <h2>{event.eventData.name}</h2>
                    <p><span className="icon">📅</span>{event.eventData.dateStart} - {event.eventData.dateEnd}</p>
                    <p><span className="icon">📍</span>{event.eventData.place}</p>
                    <button onClick={() => handleEventClick(event.eventData.eventCode)} className="event-btn">Voir les détails</button>
                  </div>
                </div>
              ))}
            </>
          )}
          {closedEvents.length > 0 && (
            <>
              <h2>Événements fermés</h2>
              {closedEvents.map(event => (
                <div className="event-item" key={event.eventData.eventCode}>
                  <img src={event.eventData.coverUrl} alt={event.eventData.name} className="event-thumbnail" />
                  <div className="event-info">
                    <span className="event-status closed">Fermé</span>
                    <h2>{event.eventData.name}</h2>
                    <p><span className="icon">📅</span>{event.eventData.dateStart} - {event.eventData.dateEnd}</p>
                    <p><span className="icon">📍</span>{event.eventData.place}</p>
                    <button onClick={() => handleEventClick(event.eventData.eventCode)} className="event-btn">Voir les détails</button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventListPage;
