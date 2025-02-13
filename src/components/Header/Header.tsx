import React from 'react';
import { Link } from 'react-router-dom';
import { BreadCrumbs } from '../BreadCrumbs/BreadCrumbs';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { ROUTES } from '../../Routes';
import './Header.css';

interface HeaderProps {
  showBreadCrumbs: boolean;
  showBurgerMenu: boolean;
  crumbs: Array<{ label: string; path: string }>;
  showProfileMenu: boolean;
  showHistory: boolean;
  showEdit: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBreadCrumbs, showBurgerMenu, crumbs, showProfileMenu, showHistory, showEdit }) => {
  return (
    <header className="header">
      <table className="header-table">
        <tbody>
          <tr>
            <td className="breadcrumbs-container">
              {showBreadCrumbs && <BreadCrumbs crumbs={crumbs} />}
            </td>
            <td className="burger-menu-container">
              {showBurgerMenu && <BurgerMenu />}
            </td>
            <td className="profile-menu-container">
              {showProfileMenu && <ProfileMenu />}
            </td>
            <td className="history-button-container">
              {showHistory && (
                <Link to={ROUTES.PROJECTS} className="history-button">
                  История
                </Link>
              )}
            </td>
            <td className="history-button-container">
              {showEdit && (
                <Link to={ROUTES.EDIT} className="history-button">
                  Редактирование
                </Link>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </header>
  );
};

export default Header;