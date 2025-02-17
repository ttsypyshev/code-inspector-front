import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/userSlice";
import "./HomePage.css";
import "../../components/global.css";
import { ROUTES } from "../../Routes.tsx";
import { RootState } from "../../store/store";
import axios from 'axios';

const MainPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state: RootState) => state.user.token);
    const projectID = useSelector((state: RootState) => state.user.projectId);

    const handleDeleteProject = async () => {
      // Проверка, что projectID не null
      if (projectID === null) {
        console.log("Невозможно удалить проект: projectID не задан");
        return true; // Возвращаем false, если projectID отсутствует
      }
    
      try {
        const response = await axios.delete(
          `http://10.0.2.2:3000/api/project/${projectID}`,
          {
            headers: {
              "Authorization": `${token}`,
            },
            timeout: 5000, // Тайм-аут 5 секунд
          }
        );
    
        if (response.status === 200) {
          console.log("Проект успешно удален!");
          return true; // Возвращаем true, если проект успешно удален
        } else {
          console.error("Ошибка при удалении проекта");
          return false; // Возвращаем false в случае других ошибок
        }
      } catch (error) {
        console.error("Ошибка при удалении проекта", error);
        return false; // Возвращаем false в случае ошибки
      }
    };

    const handleLogout = async () => {
      try {
        // Попытка удалить проект
        const isProjectDeleted = await handleDeleteProject();
        
        // Если не удалось удалить проект, не разрешаем выйти
        if (!isProjectDeleted) {
          alert("Не удалось удалить проект. Вы не можете выйти.");
          return; // Останавливаем выполнение, не даем пользователю выйти
        }
    
        const response = await axios.post(
          "http://10.0.2.2:3000/api/user/logout",
          {},
          {
            headers: {
              "Authorization": `${token}`,
              "Accept": "application/json",
            },
            timeout: 5000, // Тайм-аут 5 секунд
          }
        );
    
        // Если код ответа 401, это не ошибка, можно удалить данные
        if (response.status === 401) {
          // Удаляем данные из localStorage и state, потому что сессия уже завершена
          dispatch(logout());
          navigate(ROUTES.HOME);
          return;
        }
    
        if (response.status !== 200) {
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
        <main className="main-container">
            <div className="home-body">
                <h1 className="home-title">Проверка кода</h1>
                <p className="home-desc">Выберите языки, добавьте код, и вскоре преподаватель по достоинству оценит его.</p>
                <div className="button-group">
                    {token ? (
                        <>
                            <Link to={ROUTES.LIST}>
                                <Button variant="outline-light" className="btn-login">
                                    Перейти к списку
                                </Button>
                            </Link>
                            <Button variant="outline-light" className="btn-resume" onClick={handleLogout}>
                                Выйти
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to={ROUTES.AUTH}>
                                <Button variant="outline-light" className="btn-login">
                                    Войти
                                </Button>
                            </Link>
                            <Link to={ROUTES.LIST}>
                                <Button variant="outline-light" className="btn-resume">
                                    Продолжить как гость
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
};

export default MainPage;
