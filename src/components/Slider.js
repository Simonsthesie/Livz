import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import "./Slider.css";

function Slider() {
    const baseUrl = "http://react-responsive-carousel.js.org/assets/";
    const datas = [
        {
            id: 1,
            image: `${baseUrl}1.jpeg`,
            title: 'Titre du slider1',
            text: 'Lorem',
        },
        {
            id: 2,
            image: `${baseUrl}2.jpeg`,
            title: 'Titre du slider 2',
            text: 'Lorem',
        },
        {
            id: 3,
            image: `${baseUrl}3.jpeg`,
            title: 'Titre du slider 3',
            text: 'Lorem',
        },
        {
            id: 4,
            image: `${baseUrl}4.jpeg`,
            title: 'Titre du slider 4',
            text: 'Lorem',
        },
        {
            id: 5,
            image: `${baseUrl}5.jpeg`,
            title: 'Titre du slider 5',
            text: 'Lorem',
        },
        {
            id: 6,
            image: `${baseUrl}6.jpeg`,
            title: 'Titre du slider 6',
            text: 'Lorem',
        },
        {
            id: 7,
            image: `${baseUrl}7.jpeg`,
            title: 'Titre du slider 7',
            text: 'Lorem',
        },

    ];

    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    useEffect(() => {
        // Sélection automatique de la première image
        setSelectedPhotos([datas[0].id]);
    }, []); // La dépendance vide assure que cela ne se déclenche qu'une seule fois


    const toggleFullScreen = () => {
        const elem = document.documentElement;
        if (!isFullScreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
        setIsFullScreen(!isFullScreen);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsFullScreen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleChange = (event, id) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedPhotos([...selectedPhotos, id]); // Ajouter l'image à la liste des images sélectionnées
        } else {
            setSelectedPhotos(selectedPhotos.filter(photoId => photoId !== id)); // Retirer l'image de la liste des images sélectionnées
        }
    };

    return (
        <div className={`slider-container ${isFullScreen ? 'fullscreen' : ''}`}>
            <Carousel
                autoPlay interval={3000} infiniteLoop thumbWidth={120} showIndicators={false} showStatus={false}
                className={isFullScreen ? 'fullscreen' : ''}
            >
                {selectedPhotos.map(id => {
                    const photo = datas.find(item => item.id === id);
                    return (
                        <div key={photo.id}>
                            <img src={photo.image} alt=""/>
                            <div className="overlay">
                                <h2 className="overlay__title">{photo.title}</h2>
                                <p className="overlay__text">{photo.text}</p>
                            </div>
                        </div>
                    );
                })}
            </Carousel>
            <button className="fullscreen-button" onClick={toggleFullScreen}>
                {isFullScreen ? 'Quitter plein écran' : 'Plein écran'}
            </button>
            
            <div className="photo-container">
                {datas.map(slide => (
                    <div key={slide.id} className="photo-item">
                        <img src={slide.image} alt="" className="photo-image"/>
                        <label className="photo-label">
                            <input
                                type="checkbox"
                                checked={selectedPhotos.includes(slide.id)}
                                onChange={(event) => handleChange(event, slide.id)}
                            />
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Slider;
