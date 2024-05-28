import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import { Close, ArrowLeft, ArrowRight } from '@mui/icons-material';

const defaultImage = 'URL_DE_L_IMAGE_PAR_DEFAUT';  // Remplacez par l'URL de votre image par défaut
const logoImage = "\logolivz.png"; // Remplacez par l'URL de votre logo

const Slideshow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPhotos, eventName } = location.state || { selectedPhotos: [], eventName: '' };
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const slideshowRef = useRef(null);

  useEffect(() => {
    if (slideshowRef.current.requestFullscreen) {
      slideshowRef.current.requestFullscreen();
    } else if (slideshowRef.current.mozRequestFullScreen) {
      slideshowRef.current.mozRequestFullScreen();
    } else if (slideshowRef.current.webkitRequestFullscreen) {
      slideshowRef.current.webkitRequestFullscreen();
    } else if (slideshowRef.current.msRequestFullscreen) {
      slideshowRef.current.msRequestFullscreen();
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
      navigate(-1);
    }
  };

  const showPrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + selectedPhotos.length) % selectedPhotos.length);
  };

  const showNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % selectedPhotos.length);
  };

  return (
    <Box
      ref={slideshowRef}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      bgcolor="black"
      position="relative"
    >
      <IconButton onClick={() => navigate(-1)} style={{ position: 'absolute', top: '10px', left: '10px', color: 'white' }}>
        <img src={logoImage} alt="Logo" style={{ height: '100px', width: 'auto' }} />
      </IconButton>
      <IconButton onClick={() => navigate(-1)} style={{ position: 'absolute', top: '10px', right: '10px', color: 'white' }}>
        <Close />
      </IconButton>
      <Box display="flex" alignItems="center" justifyContent="center" height="100%" width="100%">
        <IconButton onClick={showPrevPhoto} style={{ color: 'white' }}>
          <ArrowLeft fontSize="large" />
        </IconButton>
        <img
          src={selectedPhotos[currentPhotoIndex].downloadUrl || defaultImage}
          alt={selectedPhotos[currentPhotoIndex].originalName}
          style={{ maxHeight: '100vh', maxWidth: '100vw' }}
        />
        <IconButton onClick={showNextPhoto} style={{ color: 'white' }}>
          <ArrowRight fontSize="large" />
        </IconButton>
      </Box>
      <Box
        position="absolute"
        bottom="0"
        width="100%"
        bgcolor="rgba(0, 0, 0, 0.5)"
        color="white"
        textAlign="center"
        py={1}
      >
        <Typography variant="body1">{selectedPhotos[currentPhotoIndex].author || 'Auteur inconnu'}</Typography>
        <Typography variant="body2">{eventName}</Typography>
      </Box>
    </Box>
  );
};

export default Slideshow;
