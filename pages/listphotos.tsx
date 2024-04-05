import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../static/style.css';

const ACCESS_KEY = 'jUu3iy7A8B0DAuMykgv_TGlq1DHaGurIBCocRaPJSag';
const SECRET_KEY = 'IZlTIlrJeDngn2L95c67UeNb2BzOCGU2QM01qReu4J8';

function ListPhotos(): React.FC {
  const [images, setImages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

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


  return (
    <div className="container">
      {images.map((image) => (
        <div key={image.id} className="image-card">
          <img src={image.urls.small} alt={image.description} />
          <p>{image.alt_description || 'Image description'}</p> {/* Optional: Display alt text or default text */}
          <div>
            <button className="like-button">Like</button>
            <button className="view-button">View</button>
          </div>
        </div>
      ))}
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
