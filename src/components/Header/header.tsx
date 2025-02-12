import React from 'react';
import { BreadCrumbs } from '../BreadCrumbs/BreadCrumbs'; // Используем именованный импорт
import BurgerMenu from '../BurgerMenu/BurgerMenu';

interface HeaderProps {
  showBreadCrumbs: boolean;
  showBurgerMenu: boolean;
  crumbs: Array<{ label: string; path: string }>;
}

const Header: React.FC<HeaderProps> = ({ showBreadCrumbs, showBurgerMenu, crumbs }) => {
  return (
    <header className="header">
      {showBreadCrumbs && <BreadCrumbs crumbs={crumbs} />}
      {showBurgerMenu && <BurgerMenu />}
    </header>
  );
};

export default Header;
