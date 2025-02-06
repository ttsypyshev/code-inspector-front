import React, { useState, useEffect } from 'react';
import './LanguageItem.css';
import { Lang } from "../../modules/types";

interface LangItemProps {
  lang: Lang;
  onImageLoad: () => void;
}

const LangItem: React.FC<LangItemProps> = ({ lang, onImageLoad }) => {
  // Default image URL and conditionally set imgSrc based on lang data
  const defaultImgLink = "../../../img/default-lang-image.png";
  const [imgSrc, setImgSrc] = useState(defaultImgLink);

  // Effect hook to handle fallback when image fails to load
  useEffect(() => {
    if (lang.imgLink) {
      setImgSrc(`http://localhost:9000/code-inspector/${lang.id}.png`);
    }
  }, [lang.id, lang.imgLink]);

  // Fallback in case the image fails to load
  const handleImageError = () => {
    setImgSrc(defaultImgLink);
  };

  return (
    <li key={lang.id} className="service-item">
      {/* Link to detailed information */}
      <a href={`/lang/${lang.id}`} className="service-link">
        <div className="service-title">{lang.name}</div>
        <div className="service-description">{lang.shortDescription}</div>
        <img
          className="service-image"
          src={imgSrc} // Use dynamic image source
          alt={lang.name} // Proper alt text for accessibility
          onLoad={onImageLoad} // Trigger the image load event handler
          onError={handleImageError} // Handle image loading errors
        />
      </a>

      {/* Form to add to project */}
      <form action="/add-service" method="POST" className="add-to-project-form">
        <input type="hidden" name="id_lang" value={lang.id} />
        <button
          type="submit"
          className="add-to-project-button-background"
          // You can add conditional class names here based on the language state
        >
          <div className="add-to-project-button-text">Добавить в проект</div>
        </button>
      </form>
    </li>
  );
};

export default LangItem;
