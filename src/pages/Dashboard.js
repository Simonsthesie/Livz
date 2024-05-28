import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import EventFilter from '../components/EventFilter';
import SideNav from '../components/SideNav';
import { Fab, Menu, MenuItem, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/system';
const defaultImage = process.env.PUBLIC_URL + '/assets/img/livz.png';

// Styled components
const EventCard = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  width: '100%',
  transition: 'none',
}));

const Dashboard = ({ onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fabOpen, setFabOpen] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (!authToken) {
      navigate('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://livz-backend-user.weaverize.com/users/event-list', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setEvents(response.data);
        console.log('Events:', response.data); // Afficher les données des événements pour vérification
      } catch (error) {
        console.error('Error fetching events', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://livz-backend-user.weaverize.com/users', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUserData(response.data);
        console.log('User Data:', response.data); // Afficher les informations de l'utilisateur pour vérification
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchEvents();
    fetchUserData();
  }, [authToken, navigate]);

  useEffect(() => {
    document.body.classList.toggle('blur-background', isSideNavOpen);
    return () => {
      document.body.classList.remove('blur-background');
    };
  }, [isSideNavOpen]);

  const sortedEvents = events.sort((a, b) => new Date(a.eventData.dateStart) - new Date(b.eventData.dateStart));
  const filteredEvents = sortedEvents.filter(event => {
    if (filter === 'open') {
      return event.eventData.ongoing;
    } else if (filter === 'closed') {
      return !event.eventData.ongoing;
    } else {
      return true;
    }
  });

  const handleEventClick = (eventCode) => {
    if (eventCode) {
      navigate(`/events/${eventCode}/photos`);
    } else {
      console.error('Event Code is undefined');
    }
  };

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const handleFabClick = (event) => {
    setAnchorEl(event.currentTarget);
    setFabOpen(!fabOpen);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setFabOpen(false);
  };

  const handleJoinEvent = () => {
    // Logic for joining an event
    handleMenuClose();
  };

  const handleCreateEvent = () => {
    // Logic for creating an event
    handleMenuClose();
  };

  if (loading) {
    return (
      <div className="loader-container">
        <ClipLoader color="#007bff" loading={loading} size={150} />
      </div>
    );
  }

  return (
    <div className={`g-sidenav-show bg-gray-200 ${isSideNavOpen ? 'g-sidenav-pinned' : ''}`}>
      <SideNav onLogout={onLogout} isOpen={isSideNavOpen} toggleSideNav={toggleSideNav} />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
          <div className="container-fluid py-1 px-3">
            <nav aria-label="breadcrumb">
              <h6 className="font-weight-bolder mb-0">Tous les événements</h6>
            </nav>
            <button className="navbar-toggler d-lg-none d-xl-none" type="button" onClick={toggleSideNav}>
              <div className="sidenav-toggler-inner">
                <i className="sidenav-toggler-line"></i>
                <i className="sidenav-toggler-line"></i>
                <i className="sidenav-toggler-line"></i>
              </div>
            </button>
          </div>
        </nav>
        <div className="container-fluid py-4">
          <EventFilter filter={filter} setFilter={setFilter} />
          {filteredEvents.length === 0 ? (
            <div className="alert alert-info" role="alert">
              Vous n'avez pas rejoint d'événements.
            </div>
          ) : (
            <div className="row">
              {filteredEvents.map(event => (
                <div className="col-md-4 d-flex align-items-stretch" key={event.eventData.eventCode}>
                  <EventCard className="card mb-4" onClick={() => handleEventClick(event.eventData.eventCode)}>
                    <div className="card-header p-0 position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                      <img
                        src={event.eventData.coverUrl || defaultImage}
                        className="card-img-top"
                        alt="Event Cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="badge position-absolute top-0 start-0 m-3 bg-info">
                        {event.eventData.ongoing ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{event.eventData.name}</h5>
                      <p className="card-text">{event.eventData.description}</p>
                      <p className="card-text mt-auto"><small className="text-muted">{new Date(event.eventData.dateStart).toLocaleDateString()}</small></p>
                    </div>
                  </EventCard>
                </div>
              ))}
            </div>
          )}
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleFabClick}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000
            }}
          >
            {fabOpen ? <RemoveIcon /> : <AddIcon />}
          </Fab>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            PaperProps={{
              style: {
                position: 'fixed',
                bottom: '70px',
                right: '20px',
                transform: 'translateY(-100%)',
              },
            }}
          >
            <MenuItem onClick={handleJoinEvent}>Rejoindre un événement</MenuItem>
            {userData && (userData.role === 'organisateur' || userData.role === 'admin') && (
              <MenuItem onClick={handleCreateEvent}>Créer un événement</MenuItem>
            )}
          </Menu>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
