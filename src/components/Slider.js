import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Slider.css';

function Slider() {
    const baseUrl = 'http://react-responsive-carousel.js.org/assets/';
    const datas = [
        { id: 1, image: `${baseUrl}1.jpeg`, title: 'Titre du slider1', text: 'Lorem' },
        { id: 2, image: `${baseUrl}2.jpeg`, title: 'Titre du slider 2', text: 'Lorem' },
        { id: 3, image: `${baseUrl}3.jpeg`, title: 'Titre du slider 3', text: 'Lorem' },
        { id: 4, image: `${baseUrl}4.jpeg`, title: 'Titre du slider 4', text: 'Lorem' },
        { id: 5, image: `${baseUrl}5.jpeg`, title: 'Titre du slider 5', text: 'Lorem' },
        { id: 6, image: `${baseUrl}6.jpeg`, title: 'Titre du slider 6', text: 'Lorem' },
        { id: 7, image: `${baseUrl}7.jpeg`, title: 'Titre du slider 7', text: 'Lorem' }
    ];

    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const carouselRef = useRef(null);

    useEffect(() => {
        const handleFullScreenChange = () => {
            const isFs = !!document.fullscreenElement;
            setIsFullScreen(isFs);
        };
    
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);
    
    const handleSelectionChange = (event, id) => {
        setSelectedPhotos(
            event.target.checked
            ? [...selectedPhotos, id]
            : selectedPhotos.filter(photoId => photoId !== id)
        );
    };

    const toggleFullScreen = () => {
        const elem = carouselRef.current;
        if (!document.fullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        setIsFullScreen(!isFullScreen);
    };
    
    

    return (
        <div className="slider-container">
            <div className="photo-container">
                {datas.map(photo => (
                    <div key={photo.id} className="photo-item">
                        <img src={photo.image} alt={photo.title} className="photo-image" />
                        <label className="photo-label">
                            <input
                                type="checkbox"
                                checked={selectedPhotos.includes(photo.id)}
                                onChange={(event) => handleSelectionChange(event, photo.id)}
                            /> Sélectionner
                        </label>
                    </div>
                ))}
            </div>
            {selectedPhotos.length > 0 && (
                <button className="launch-fullscreen-button" onClick={toggleFullScreen}>
                    {isFullScreen ? 'Quitter plein écran' : 'Lancer le diaporama en plein écran'}
                </button>
            )}
            <div ref={carouselRef} className="carousel-container">
                <Carousel
                    autoPlay
                    interval={3000}
                    infiniteLoop
                    showIndicators={false}
                    showThumbs={false}
                    showStatus={false}
                    className={isFullScreen ? 'fullscreen' : ''}
                >
                    {selectedPhotos.map(id => {
                        const photo = datas.find(item => item.id === id);
                        return (
                            <div key={photo.id}>
                                <img src={photo.image} alt={photo.title} />
                                <p className="legend">{photo.title}</p>
                            </div>
                        );
                    })}
                </Carousel>
            </div>
        </div>
    );
}

export default Slider;
