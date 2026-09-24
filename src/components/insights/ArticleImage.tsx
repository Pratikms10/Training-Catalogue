import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ArticleImageProps {
  image: string;
  alt: string;
  className: string;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({ image, alt, className }) => {
  if (image) {
    return <img src={image} alt={alt} className={className} loading="lazy" />;
  }

  return (
    <div className={`${className} insights-article-placeholder`} role="img" aria-label={`${alt}. Editorial image placeholder.`}>
      <ImageIcon aria-hidden="true" />
      <span aria-hidden="true">Editorial image</span>
    </div>
  );
};
