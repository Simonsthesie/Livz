// src/components/Slideshow.js
import React, { useState, useEffect } from 'react';
import '../styles/Slideshow.css';

const Slideshow = ({ photos, onClose }) => {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [intervalTime, setIntervalTime] = useState(3); // Interval in seconds
  const [backgroundColor, setBackgroundColor] = useState('#000'); // Default background color
  const [transitionEffect, setTransitionEffect] = useState('fade'); // Default transition effect
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [transitionClass, setTransitionClass] = useState('');

  useEffect(() => {
    let timer;
    if (showSlideshow && selectedPhotos.length > 0) {
      timer = setInterval(() => {
        setTransitionClass('');
        setTimeout(() => {
          setTransitionClass(transitionEffect);
          setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % selectedPhotos.length);
        }, 50); // Timeout to trigger CSS transition
      }, intervalTime * 1000);
    }
    return () => clearInterval(timer);
  }, [showSlideshow, selectedPhotos, intervalTime, transitionEffect]);

  const handlePhotoClick = (photo) => {
    if (selectedPhotos.includes(photo)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== photo));
    } else {
      setSelectedPhotos([...selectedPhotos, photo]);
    }
  };

  const startSlideshow = () => {
    if (selectedPhotos.length > 0) {
      setShowSlideshow(true);
      setCurrentPhotoIndex(0);
    } else {
      alert('Veuillez sélectionner au moins une photo pour le diaporama.');
    }
  };

  return (
    <div className="slideshow-container" style={{ backgroundColor }}>
      {showSlideshow ? (
        <div className="slideshow">
          <img
            src={selectedPhotos[currentPhotoIndex]?.downloadUrl}
            alt="Slideshow"
            className={`slideshow-photo ${transitionClass}`}
          />
          <button
            className="slideshow-btn prev"
            onClick={() => {
              setTransitionClass('');
              setTimeout(() => {
                setTransitionClass(transitionEffect);
                setCurrentPhotoIndex((currentPhotoIndex - 1 + selectedPhotos.length) % selectedPhotos.length);
              }, 50);
            }}
          >
            &#10094;
          </button>
          <button
            className="slideshow-btn next"
            onClick={() => {
              setTransitionClass('');
              setTimeout(() => {
                setTransitionClass(transitionEffect);
                setCurrentPhotoIndex((currentPhotoIndex + 1) % selectedPhotos.length);
              }, 50);
            }}
          >
            &#10095;
          </button>
          <button className="slideshow-close-btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      ) : (
        <div>
          <button className="btn-back" onClick={onClose}>
            <i className="fas fa-arrow-left"></i> Retour
          </button>
          <h3>Sélectionnez les photos pour le diaporama :</h3>
          <div className="photo-selection">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`photo-container ${selectedPhotos.includes(photo) ? 'selected' : ''}`}
                onClick={() => handlePhotoClick(photo)}
              >
                <img src={photo.thumbnail} alt={`photo-${index}`} className="photo" />
                {selectedPhotos.includes(photo) && <span className="selected-label">Validé</span>}
              </div>
            ))}
          </div>
          <button className="btn btn-options" onClick={() => setShowOptions(!showOptions)}>
            Plus d'options de diaporama
          </button>
          {showOptions && (
            <div className="slideshow-options">
              <label htmlFor="interval">Intervalle (secondes):</label>
              <input
                type="number"
                id="interval"
                value={intervalTime}
                onChange={(e) => setIntervalTime(Number(e.target.value))}
                min="1"
              />
              <label htmlFor="backgroundColor">Couleur de fond:</label>
              <input
                type="color"
                id="backgroundColor"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
              />
              <label htmlFor="transitionEffect">Effet de transition:</label>
              <select
                id="transitionEffect"
                value={transitionEffect}
                onChange={(e) => setTransitionEffect(e.target.value)}
              >
                <option value="fade">Fondu</option>
                <option value="slide">Glissement</option>
              </select>
            </div>
          )}
          <button className="btn" onClick={startSlideshow}>
            Démarrer le diaporama
          </button>
        </div>
      )}
    </div>
  );
};

export default Slideshow;
