import { useState } from "react";
import "./ProfileMenu.css";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store/store";
import { ROUTES } from "../../Routes.tsx";
import { logout } from "../../store/slices/userSlice";

export const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.profile);
  const token = useSelector((state: RootState) => state.user.token);
  const projectID = useSelector((state: RootState) => state.user.projectId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Функция для удаления проекта
  const handleDeleteProject = async () => {
    // Проверка, что projectID не null
    if (projectID === null) {
      console.log("Невозможно удалить проект: projectID не задан");
      return true; // Возвращаем false, если projectID отсутствует
    }

    try {
      const response = await fetch(`/api/project/${projectID}`, {
        method: "DELETE",
        headers: {
          "Authorization": `${token}`,
        },
      });

      if (response.ok) {
        console.log("Проект успешно удален!");
        return true; // Возвращаем true, если проект успешно удален
      } else {
        const errorData = await response.json();

        // Проверка на ошибку с кодом 400 и конкретным сообщением
        if (response.status === 400 && errorData.message === "[err] project cannot be deleted, formation date found") {
          console.log("Проект успешно удален!"); // Выводим нужное сообщение в случае этой ошибки
          return true; // В случае этой ошибки мы тоже считаем, что проект удален
        }

        console.error(errorData.message || "Ошибка при удалении проекта");
        return false; // Возвращаем false в случае других ошибок
      }
    } catch (error) {
      console.error("Ошибка при удалении проекта", error);
      return false; // Возвращаем false в случае ошибки
    }
  };

  // Функция выхода
  const handleLogout = async () => {
    try {
      // Попытка удалить проект
      const isProjectDeleted = await handleDeleteProject();
      
      // Если не удалось удалить проект, не разрешаем выйти
      if (!isProjectDeleted) {
        alert("Не удалось удалить проект. Вы не можете выйти.");
        return; // Останавливаем выполнение, не даем пользователю выйти
      }

      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Authorization": `${token}`,
        },
      });

      // Если код ответа 401, это не ошибка, можно удалить данные
      if (response.status === 401) {
        // Удаляем данные из localStorage и state, потому что сессия уже завершена
        dispatch(logout());
        navigate(ROUTES.HOME);
        return;
      }

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
      {token ? (
        // Если пользователь залогинен, показываем имя и меню
        <>
          <button className="Profile-button" onClick={() => setIsOpen(!isOpen)}>
            {user.name || user.username}
          </button>
          {isOpen && (
            <nav className="Profile-menu">
              <ul>
                <li><Link to={ROUTES.PROFILE} className="menu-button">Профиль</Link></li>
                <li><button onClick={handleLogout} className="menu-button">Выйти</button></li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        // Если пользователь не залогинен, показываем кнопку для перехода на страницу входа
        <Link to={ROUTES.AUTH} className="Profile-button">Войти</Link>
      )}
    </div>
  );
};

export default ProfileMenu;
