import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../static/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faEye } from '@fortawesome/free-solid-svg-icons';
import NavigationBar from './NavigationBar';

const ACCESS_KEY = 'jUu3iy7A8B0DAuMykgv_TGlq1DHaGurIBCocRaPJSag';
const SECRET_KEY = 'IZlTIlrJeDngn2L95c67UeNb2BzOCGU2QM01qReu4J8';

function ListPhotos(): React.FC {
  const [images, setImages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [likedImages, setLikedImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const imagesData = await getImages(currentPage);
      setImages([...images, ...imagesData]);
      if (imagesData.length === 0) {
        setIsLastPage(true);
      }
    }
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    function handleScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (!isLastPage && currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPage, isLastPage, totalPages]);

  const toggleLike = (imageId: string) => {
    if (likedImages.includes(imageId)) {
      setLikedImages(likedImages.filter(id => id !== imageId));
    } else {
      setLikedImages([...likedImages, imageId]);
    }
  };

  return (
    <div className="container">
        <NavigationBar /> 
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.id} className="image-card">
            <img src={image.urls.small} alt={image.description} />
            <p>{image.alt_description || 'Image description'}</p>
            <div>
              <button className="like-button" onClick={() => toggleLike(image.id)}>
                <FontAwesomeIcon icon={faThumbsUp} color={likedImages.includes(image.id) ? 'blue' : 'black'} />
              </button>
              <button className="view-button">
                <FontAwesomeIcon icon={faEye} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isLastPage && <div>Fin des images</div>}
    </div>
  );
}

async function getImages(page = 1, perPage = 10) {
  const headers = {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  };
  const response = await axios.get(
    `https://api.unsplash.com/photos/?page=${page}&per_page=${perPage}`,
    { headers }
  );
  return response.data;
}

async function getTotalPages(perPage = 10) {
  const headers = {
    Authorization: `Client-ID ${ACCESS_KEY}`,
  };
  const response = await axios.get(
    `https://api.unsplash.com/photos/?per_page=${perPage}`,
    { headers }
  );
  const total = parseInt(response.headers['x-total']);
  return Math.ceil(total / perPage);
}

export default ListPhotos;
