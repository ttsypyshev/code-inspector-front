import { useState } from "react";
import "./BurgerMenu.css";
import { Link } from 'react-router-dom';

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="burger-menu-container">
      <button className="burger-button" onClick={() => setIsOpen(!isOpen)}>
        <img src="/code-inspector-front/img/icon-btn-burger.png" alt="Menu" />
      </button>
      {isOpen && (
        <nav className="burger-menu">
            <ul>
                <li><Link to={`/`} className="menu-button">Главная</Link></li>
                <li><Link to={`/info`} className="menu-button">Языки</Link></li>
            </ul>
        </nav>
      )}
    </div>
  );
};

export default BurgerMenu;
