import React, { useState, useEffect } from 'react';
import './LanguageItem.css';
import { Lang } from "../../modules/types";
import { Link } from 'react-router-dom';
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from 'react-redux';
import { setProjectID } from '../../store/slices/userSlice';

interface LangItemProps {
  lang: Lang;
  onImageLoad: () => void;
  onAddToCart: () => void;
}

const LangItem: React.FC<LangItemProps> = ({ lang, onImageLoad, onAddToCart }) => {
  const defaultImgLink = "img/default-lang-image.png";
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [status, setStatus] = useState<'success-btn' | 'error-btn' | ''>('');
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.profile);
  const dispatch = useDispatch();

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

  const handleAddToProject = async () => {
    setStatus('');
    try {
        const response = await fetch("/api/info/add-service", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`,
            },
            body: JSON.stringify({ id_lang: lang.id }),
        });

        if (response.ok) {
          const data = await response.json(); // Получаем данные из ответа
          
          // Проверьте правильность ключа: убедитесь, что используете правильный ключ из ответа
          const projectId = data.projectID;  // Исправили на правильный ключ

          // Убедитесь, что функция dispatch работает корректно
          dispatch(setProjectID(projectId));

          setStatus('success-btn');
          onAddToCart();
        } else {
            setStatus('error-btn');
        }
    } catch (error) {
        console.error('Ошибка при добавлении в проект:', error);
        setStatus('error-btn');
    }
  };

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
      </Link>
      <button
        type="button"
        className={`add-to-project-button-background ${status}`}
        onClick={handleAddToProject}
      >
        <div className="add-to-project-button-text">Добавить в проект</div>
      </button>
    </li>
  );
};

export default LangItem;
