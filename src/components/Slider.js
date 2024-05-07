import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Slider.css';

function Slider() {
    const baseUrl = 'http://react-responsive-carousel.js.org/assets/';
    const initialData = [
        { id: 1, image: `${baseUrl}1.jpeg`, title: 'Titre du slider1', text: 'Lorem' },
        { id: 2, image: `${baseUrl}2.jpeg`, title: 'Titre du slider 2', text: 'Lorem' },
        { id: 3, image: `${baseUrl}3.jpeg`, title: 'Titre du slider 3', text: 'Lorem' },
        { id: 4, image: `${baseUrl}4.jpeg`, title: 'Titre du slider 4', text: 'Lorem' },
        { id: 5, image: `${baseUrl}5.jpeg`, title: 'Titre du slider 5', text: 'Lorem' },
        { id: 6, image: `${baseUrl}6.jpeg`, title: 'Titre du slider 6', text: 'Lorem' },
        { id: 7, image: `${baseUrl}7.jpeg`, title: 'Titre du slider 7', text: 'Lorem' }
    ];

    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [showCarousel, setShowCarousel] = useState(false);
    const carouselRef = useRef(null);
    
    const adjustImageSize = () => {
        const slides = document.querySelectorAll('.carousel .slide img');
        slides.forEach(img => {
            const slide = img.closest('.slide');
            const slideHeight = slide.clientHeight;
            const slideWidth = slide.clientWidth;
            const imgHeight = img.naturalHeight;
            const imgWidth = img.naturalWidth;
            const imgRatio = imgWidth / imgHeight;
            const slideRatio = slideWidth / slideHeight;

            if (imgRatio > slideRatio) {
                img.style.width = '100%';
                img.style.height = 'auto';
            } else {
                img.style.height = '100%';
                img.style.width = 'auto';
            }
        });
    };

    useEffect(() => {
        const handleResize = () => {
            adjustImageSize();
        };

        if (showCarousel) {
            adjustImageSize();
            window.addEventListener('resize', handleResize);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [showCarousel]); 
    
    const handleSelectPhoto = (id) => {
        const isAlreadySelected = selectedPhotos.includes(id);
        setSelectedPhotos(isAlreadySelected ? selectedPhotos.filter(photoId => photoId !== id) : [...selectedPhotos, id]);
    };

    const toggleFullScreen = () => {
        const elem = carouselRef.current;
        if (elem) {
            if (!document.fullscreenElement) {
                elem.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                document.exitFullscreen();
            }
        }
    };

    const startSlideshow = () => {
        setShowCarousel(true);
        toggleFullScreen();
    };

    const stopSlideshow = () => {
        setShowCarousel(false);
        setSelectedPhotos([]);
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            const isFs = !!document.fullscreenElement;
            if (!isFs) { // Automatically exit slideshow if fullscreen is exited
                stopSlideshow();
            }
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, []);

    return (
        <div className="slider-container" ref={carouselRef}>
            {!showCarousel ? (
                <>
                    <div className="photo-container">
                        {initialData.map(photo => (
                            <div key={photo.id} className="photo-item">
                                <img src={photo.image} alt={photo.title} className="photo-image" />
                                <div className="photo-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedPhotos.includes(photo.id)}
                                        onChange={() => handleSelectPhoto(photo.id)}
                                    /> Select
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="start-selection-button" onClick={startSlideshow} disabled={!selectedPhotos.length}>
                        Démarrer le diapo
                    </button>
                </>
            ) : (
                <>
            <Carousel
                autoPlay
                interval={4000}  // Basculer toutes les 4 secondes
                infiniteLoop
                showIndicators={false}
                showThumbs={false}
                showStatus={false}
                useKeyboardArrows
                transitionTime={1000}  // Durée de la transition, vous pouvez ajuster selon vos besoins
                emulateTouch  // Permettre la navigation tactile sur mobile
            >
                {selectedPhotos.map(id => {
                    const photo = initialData.find(item => item.id === id);
                    return (
                        <div key={id} className="slide">
                            <img src={photo.image} alt={photo.title} />
                            <div className="legend">
                                <strong>{photo.title}</strong><br/>
                                {photo.text}
                            </div>
                        </div>
                    );
                })}
            </Carousel>
                    <button className="launch-fullscreen-button" onClick={stopSlideshow}>
                        Quitter le diapo
                    </button>
                </>
            )}
        </div>
    );
}

export default Slider;
