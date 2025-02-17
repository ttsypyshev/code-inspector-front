import "./BurgerMenu.css";
import { Link } from 'react-router-dom';
import { ROUTES } from "../../Routes.tsx";
import { useState } from "react";

interface BurgerMenuProps {
  showProfileMenu: boolean;
  showHistory: boolean;
  showEdit: boolean;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({showProfileMenu, showHistory, showEdit }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="burger-menu-container">
      <button className="burger-button" onClick={() => setIsOpen(!isOpen)}>
        <img src="/img/icon-btn-burger.png" alt="Menu" />
      </button>
      {isOpen && (
        <nav className="burger-menu">
          <ul>
            <li><Link to={ROUTES.HOME} className="menu-button">Главная</Link></li>
            <li><Link to={ROUTES.LIST} className="menu-button">Языки</Link></li>
            {showProfileMenu && <li><Link to={ROUTES.PROFILE} className="menu-button">Профиль</Link></li>}
            {showHistory && <li><Link to={ROUTES.PROJECTS} className="menu-button">История</Link></li>}
            {showEdit && <li><Link to={ROUTES.EDIT} className="menu-button">Редактирование</Link></li>}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default BurgerMenu;