import React from 'react';
import { CareerPhoto } from '../../data/careersData';

interface CareerPhotoGalleryProps {
  photos: CareerPhoto[];
}

const PhotoRow: React.FC<CareerPhotoGalleryProps> = ({ photos }) => {
  const renderPhotoSet = (isRepeat: boolean) =>
    photos.map((photo, index) => (
      <figure
        className="career-photo-gallery__card"
        key={`${photo.id}-${isRepeat ? 'repeat' : 'original'}`}
        aria-hidden={isRepeat}
      >
        <img
          src={photo.src}
          alt={isRepeat ? '' : photo.alt}
          style={{ objectPosition: photo.position }}
          loading={!isRepeat && index < 2 ? 'eager' : 'lazy'}
          decoding="async"
        />
      </figure>
    ));

  return (
    <div className="career-photo-gallery__row">
      <div className="career-photo-gallery__track">
        <div className="career-photo-gallery__track-set">{renderPhotoSet(false)}</div>
        <div className="career-photo-gallery__track-set" aria-hidden="true">{renderPhotoSet(true)}</div>
      </div>
    </div>
  );
};

export const CareerPhotoGallery: React.FC<CareerPhotoGalleryProps> = ({ photos }) => {
  return (
    <section className="career-photo-gallery" aria-label="Life at TechnoEdge photo gallery">
      <div className="career-photo-gallery__frame">
        <PhotoRow photos={photos} />
      </div>
    </section>
  );
};
