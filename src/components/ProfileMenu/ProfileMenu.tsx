import { useState } from "react";
import "./ProfileMenu.css";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store/store";
import { ROUTES } from "../../Routes.tsx";
import { logout } from "../../store/slices/userSlice";

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const username = useSelector((state: RootState) => state.user.profile.username);
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Authorization": `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка при выходе");
      }

      // Если запрос успешен, удаляем данные из localStorage и state
      dispatch(logout());

      // Перенаправляем на главную страницу
      navigate(ROUTES.HOME);
    } catch (error) {
      alert("Ошибка"); // Показать ошибку, если запрос не прошел
    }
  };

  return (
    <div className="Profile-menu-container">
      <button className="Profile-button" onClick={() => setIsOpen(!isOpen)}>
        {username}
      </button>
      {isOpen && (
        <nav className="Profile-menu">
          <ul>
            <li><Link to={ROUTES.PROFILE} className="menu-button">Профиль</Link></li>
            <li><button onClick={handleLogout} className="menu-button">Выйти</button></li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProfileMenu;
