import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  IconButton,
  Grid,
  Box,
  Modal,
  Card,
  CardMedia,
  Button,
  Checkbox
} from '@mui/material';
import { ArrowBack, Close, ArrowLeft, ArrowRight, Slideshow } from '@mui/icons-material';

const defaultImage = 'URL_DE_L_IMAGE_PAR_DEFAUT';  // Remplacez par l'URL de votre image par défaut

const PhotoGalleryPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(null);
  const authToken = localStorage.getItem('authToken');
  const [eventDetails, setEventDetails] = useState({ name: '', coverUrl: '' });
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  useEffect(() => {
    const fetchAllPhotos = async () => {
      let allPhotos = [];
      let page = 0;
      let hasMorePhotos = true;

      while (hasMorePhotos) {
        try {
          const response = await axios.get(`https://livz-backend-media.weaverize.com/media/all-media?eventId=${eventId}&favorites=false&photos=true&videos=false&page=${page}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });

          if (response.data.result && response.data.result.length > 0) {
            allPhotos = [...allPhotos, ...response.data.result];
            page += 1;
          } else {
            hasMorePhotos = false;
          }
        } catch (error) {
          console.error('Error fetching photos', error);
          hasMorePhotos = false;
        }
      }

      allPhotos.sort((a, b) => new Date(b.date) - new Date(a.date));  // Trier les photos par date
      setPhotos(allPhotos);
    };

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get('https://livz-backend-user.weaverize.com/users/event-list', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (response.data) {
          const event = response.data.find(e => e.eventData.eventCode === eventId);
          if (event) {
            setEventDetails(event.eventData);
          }
        }
      } catch (error) {
        console.error('Error fetching event details', error);
      }
    };

    fetchAllPhotos();
    fetchEventDetails();
  }, [eventId, authToken]);

  const handlePhotoClick = (index) => {
    setModalPhotoIndex(index);
  };

  const closeModal = () => {
    setModalPhotoIndex(null);
  };

  const showPrevPhoto = (e) => {
    e.stopPropagation();
    setModalPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  const showNextPhoto = (e) => {
    e.stopPropagation();
    setModalPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePhotoSelection = (photo) => {
    setSelectedPhotos((prevSelected) =>
      prevSelected.includes(photo)
        ? prevSelected.filter((p) => p !== photo)
        : [...prevSelected, photo]
    );
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">{eventDetails.name}</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Slideshow />}
            onClick={() => navigate('/slideshow', { state: { selectedPhotos, eventName: eventDetails.name } })}
            style={{ marginRight: '10px' }}
          >
            Diaporama
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => console.log('Selected photos:', selectedPhotos)}
          >
            Valider les photos
          </Button>
        </Box>
      </Box>
      <Box textAlign="center" mb={4}>
        <CardMedia
          component="img"
          alt="Event Cover"
          image={eventDetails.coverUrl || defaultImage}
          style={{ maxHeight: '400px', margin: '0 auto' }}
        />
      </Box>
      <Grid container spacing={2}>
        {photos.map((photo, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={photo.id}>
            <Card>
              <Checkbox
                checked={selectedPhotos.includes(photo)}
                onChange={() => handlePhotoSelection(photo)}
                style={{ position: 'absolute', zIndex: 1 }}
              />
              <CardMedia
                component="img"
                alt={photo.originalName}
                height="140"
                image={photo.thumbnail || defaultImage}
                onClick={() => handlePhotoClick(index)}
                style={{ cursor: 'pointer' }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal open={modalPhotoIndex !== null} onClose={closeModal}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          bgcolor="rgba(0, 0, 0, 0.8)"
        >
          <IconButton onClick={closeModal} style={{ alignSelf: 'flex-end' }}>
            <Close style={{ color: 'white' }} />
          </IconButton>
          <Box display="flex" alignItems="center">
            <IconButton onClick={showPrevPhoto}>
              <ArrowLeft style={{ color: 'white' }} />
            </IconButton>
            {photos[modalPhotoIndex] && (
              <img
                src={photos[modalPhotoIndex].downloadUrl || defaultImage}
                alt={photos[modalPhotoIndex].originalName}
                style={{ maxHeight: '80vh', maxWidth: '80vw' }}
              />
            )}
            <IconButton onClick={showNextPhoto}>
              <ArrowRight style={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default PhotoGalleryPage;