import React, { useState, useEffect } from 'react';
import './LanguageItem.css';
import { Lang } from "../../modules/types";
import { Link } from 'react-router-dom';

interface LangItemProps {
  lang: Lang;
  onImageLoad: () => void;
}

const LangItem: React.FC<LangItemProps> = ({ lang, onImageLoad }) => {
  const defaultImgLink = "img/default-lang-image.png";
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (lang.imgLink) {
      const testImage = new Image();
      testImage.src = `/img-proxy/code-inspector/${lang.id}.png`;
      testImage.onload = () => {
        setImgSrc(testImage.src);
        setIsImageLoaded(true);
      };
      testImage.onerror = () => {
        setImgSrc(defaultImgLink);
        setIsImageLoaded(true);
      };
    } else {
      setImgSrc(defaultImgLink);
      setIsImageLoaded(true);
    }
  }, [lang.id, lang.imgLink]);

  return (
    <li key={lang.id} className="service-item">
      <Link to={`/lang/${lang.id}`} className="service-link">
        {isImageLoaded && (
          <img
            className="service-image"
            src={imgSrc!}
            alt={lang.name}
            onLoad={onImageLoad}
          />
        )}
        <div className="service-title">{lang.name}</div>
        <div className="service-description">{lang.shortDescription}</div>

        <form action="/add-service" method="POST" className="add-to-project-form">
          <input type="hidden" name="id_lang" value={lang.id} />
          <button
            type="submit"
            className="add-to-project-button-background"
          >
            <div className="add-to-project-button-text">Добавить в проект</div>
          </button>
        </form>
      </Link>
    </li>
  );  
};

export default LangItem;
