import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ACCESS_KEY = 'YOUR_ACCESS_KEY';
const SECRET_KEY = 'YOUR_SECRET_KEY';

function List(): React.FC {
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
    async function getTotalPagesData() {
      const totalPagesData = await getTotalPages();
      setTotalPages(totalPagesData);
    }
    getTotalPagesData();
  }, []);

  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (!isLastPage && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  }

  window.addEventListener('scroll', handleScroll);

  return (
    <div>
      {images.map((image) => (
        <img key={image.id} src={image.urls.small} alt={image.description} />
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
