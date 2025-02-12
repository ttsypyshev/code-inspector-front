import React from 'react';
import { Link } from 'react-router-dom';
import { BreadCrumbs } from '../BreadCrumbs/BreadCrumbs';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { ROUTES } from '../../Routes';

interface HeaderProps {
  showBreadCrumbs: boolean;
  showBurgerMenu: boolean;
  crumbs: Array<{ label: string; path: string }>;
  showProfileMenu: boolean;
  showHistory: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBreadCrumbs, showBurgerMenu, crumbs, showProfileMenu, showHistory }) => {
  return (
    <header className="header">
      {showBreadCrumbs && <BreadCrumbs crumbs={crumbs} />}
      {showBurgerMenu && <BurgerMenu />}
      {showProfileMenu && <ProfileMenu />}

      {showHistory && (
        <Link to={ROUTES.PROJECTS} className="history-button">
          История
        </Link>
      )}
    </header>
  );
};

export default Header;
