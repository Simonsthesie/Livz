import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import UserProfileBanner from '../components/UserProfileBanner';
import '../styles/PhotoGalleryPage.css';

const PhotoGalleryPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(null);
  const authToken = localStorage.getItem('authToken');
  const [currentUser, setCurrentUser] = useState({ username: '', selfieUrl: '' });
  const [currentThumbnailPage, setCurrentThumbnailPage] = useState(0);
  const thumbnailsPerPage = 10;

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

      setPhotos(allPhotos);
    };

    fetchAllPhotos();
  }, [eventId, authToken]);

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
      const date = new Date(photo.date);
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

  const flatPhotosArray = Object.values(groupedPhotos).flat();

  const handlePhotoClick = (index) => {
    const photo = flatPhotosArray[index];
    setModalPhotoIndex(index);
    setCurrentUser({ username: photo.username, selfieUrl: photo.selfieUrl });
    setCurrentThumbnailPage(0);  // Reset to the first page of thumbnails
  };

  useEffect(() => {
    if (modalPhotoIndex !== null) {
      const photo = flatPhotosArray[modalPhotoIndex];
      setCurrentUser({ username: photo.username, selfieUrl: photo.selfieUrl });
    }
  }, [modalPhotoIndex]);

  const closeModal = () => {
    setModalPhotoIndex(null);
  };

  const showPrevPhoto = (e) => {
    e.stopPropagation();
    setModalPhotoIndex((prevIndex) => (prevIndex - 1 + flatPhotosArray.length) % flatPhotosArray.length);
  };

  const showNextPhoto = (e) => {
    e.stopPropagation();
    setModalPhotoIndex((prevIndex) => (prevIndex + 1) % flatPhotosArray.length);
  };

  const handleThumbnailClick = (index, e) => {
    e.stopPropagation();
    setModalPhotoIndex(index);
  };

  const handleNextThumbnailPage = () => {
    if ((currentThumbnailPage + 1) * thumbnailsPerPage < flatPhotosArray.length) {
      setCurrentThumbnailPage(currentThumbnailPage + 1);
    }
  };

  const handlePrevThumbnailPage = () => {
    if (currentThumbnailPage > 0) {
      setCurrentThumbnailPage(currentThumbnailPage - 1);
    }
  };

  const displayedThumbnails = flatPhotosArray.slice(
    currentThumbnailPage * thumbnailsPerPage,
    (currentThumbnailPage + 1) * thumbnailsPerPage
  );

  return (
    <div className="container">
      <button className="btn btn-back" onClick={() => navigate(-1)}>
        <i className="fas fa-arrow-left"></i> Retour
      </button>
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
                  <div className="photo-container" key={photo.id} onClick={() => handlePhotoClick(flatPhotosArray.indexOf(photo))}>
                    <img src={photo.thumbnail} alt={photo.originalName} className="photo" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {modalPhotoIndex !== null && (
        <>
          <UserProfileBanner 
            username={currentUser.username} 
            selfieUrl={currentUser.selfieUrl} 
          />
          <div className="modal" onClick={closeModal}>
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <button className="modal-prev" onClick={showPrevPhoto}>&#10094;</button>
            <div className="modal-content-container">
              <img className="modal-content" src={flatPhotosArray[modalPhotoIndex].downloadUrl} alt={flatPhotosArray[modalPhotoIndex].originalName} />
            </div>
            <button className="modal-next" onClick={showNextPhoto}>&#10095;</button>
            <div className="thumbnail-gallery">
              <button className="thumbnail-nav prev" onClick={handlePrevThumbnailPage}>&#10094;</button>
              {displayedThumbnails.map((photo, index) => (
                <img
                  key={index}
                  src={photo.thumbnail}
                  alt={photo.originalName}
                  className={`thumbnail ${modalPhotoIndex === flatPhotosArray.indexOf(photo) ? 'active' : ''}`}
                  onClick={(e) => handleThumbnailClick(flatPhotosArray.indexOf(photo), e)}
                />
              ))}
              <button className="thumbnail-nav next" onClick={handleNextThumbnailPage}>&#10095;</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoGalleryPage;
