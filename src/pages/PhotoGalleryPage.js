import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import '../styles/PhotoGalleryPage.css';

const PhotoGalleryPage = () => {
  const { eventId } = useParams();
  const history = useHistory();
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [interval, setInterval] = useState(3); // Interval in seconds
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectingPhotos, setSelectingPhotos] = useState(false);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(null); // State for modal photo index
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`https://livz-backend-media.weaverize.com/media/all-media?eventId=${eventId}&favorites=false&photos=true&videos=false&page=0`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        setPhotos(response.data.result);
      } catch (error) {
        console.error('Error fetching photos', error);
      }
    };

    fetchPhotos();
  }, [eventId, authToken]);

  const handleCheckboxChange = (photo) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(selectedPhotos.filter(p => p !== photo));
    } else {
      setSelectedPhotos([...selectedPhotos, photo]);
    }
  };

  const startSlideshow = () => {
    setShowSlideshow(true);
    setCurrentPhotoIndex(0);
  };

  useEffect(() => {
    let timer;
    if (showSlideshow && selectedPhotos.length > 0) {
      timer = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % selectedPhotos.length);
      }, interval * 1000);
    }
    return () => clearInterval(timer);
  }, [showSlideshow, selectedPhotos, interval]);

  const closeSlideshow = () => {
    setShowSlideshow(false);
    setCurrentPhotoIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSlideshow();
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!isValid(date)) return { day: 'Invalid date', time: '' };
    return {
      day: format(date, 'EEEE d MMMM yyyy', { locale: fr }),
      time: format(date, "'De' HH:mm 'à' HH:mm", { locale: fr })
    };
  };

  const groupPhotosByDay = (photos) => {
    const groupedPhotos = {};
    photos.forEach(photo => {
      const date = new Date(photo.date); // Use the date field from your photo object
      if (!isValid(date)) return;
      const dateKey = format(date, 'yyyy-MM-dd');
      if (!groupedPhotos[dateKey]) {
        groupedPhotos[dateKey] = [];
      }
      groupedPhotos[dateKey].push(photo);
    });
    return groupedPhotos;
  };

  const groupedPhotos = groupPhotosByDay(photos);

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

  return (
    <div className="container">
      <button className="btn btn-back" onClick={() => history.goBack()}>Back to previous page</button>
      <h2>Photos de l'événement {eventId}</h2>
      <div className="photo-gallery">
        {Object.keys(groupedPhotos).map(dateKey => {
          const datePhotos = groupedPhotos[dateKey];
          const formattedDate = formatDate(dateKey);
          return (
            <div key={dateKey} className="photo-day-group">
              <div className="photo-date">{formattedDate.day}</div>
              <div className="photos-row">
                {datePhotos.map((photo, index) => (
                  <div className="photo-container" key={photo.id} onClick={() => handlePhotoClick(index)}>
                    <img src={photo.thumbnail} alt={photo.originalName} className="photo" />
                    {selectingPhotos && (
                      <input
                        type="checkbox"
                        className="photo-checkbox"
                        onChange={() => handleCheckboxChange(photo.downloadUrl)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {!selectingPhotos ? (
        <button className="btn" onClick={() => setSelectingPhotos(true)}>
          Lancer un diaporama ?
        </button>
      ) : (
        <>
          {selectedPhotos.length > 0 && (
            <div className="selected-photos-preview">
              <h3>Photos sélectionnées :</h3>
              <div className="selected-photos">
                {selectedPhotos.map((photo, index) => (
                  <img key={index} src={photo} alt="Selected" className="selected-photo" />
                ))}
              </div>
            </div>
          )}
          <div className="slideshow-controls">
            <label htmlFor="interval">Intervalle (secondes):</label>
            <input
              type="number"
              id="interval"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              min="1"
            />
            <button className="btn" onClick={startSlideshow} disabled={selectedPhotos.length === 0}>
              Démarrer le diaporama
            </button>
          </div>
        </>
      )}
      {showSlideshow && (
        <div className="slideshow-container">
          <img
            src={selectedPhotos[currentPhotoIndex]}
            alt="Slideshow"
            className="slideshow-photo"
          />
          <button className="slideshow-btn prev" onClick={() => setCurrentPhotoIndex((currentPhotoIndex - 1 + selectedPhotos.length) % selectedPhotos.length)}>
            Précédent
          </button>
          <button className="slideshow-btn next" onClick={() => setCurrentPhotoIndex((currentPhotoIndex + 1) % selectedPhotos.length)}>
            Suivant
          </button>
          <button className="slideshow-close-btn" onClick={closeSlideshow}>
            Fermer
          </button>
        </div>
      )}
      {modalPhotoIndex !== null && (
        <div className="modal" onClick={closeModal}>
          <span className="modal-close" onClick={closeModal}>&times;</span>
          <button className="modal-prev" onClick={showPrevPhoto}>&#10094;</button>
          <img className="modal-content" src={photos[modalPhotoIndex].downloadUrl} alt={photos[modalPhotoIndex].originalName} />
          <button className="modal-next" onClick={showNextPhoto}>&#10095;</button>
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryPage;
