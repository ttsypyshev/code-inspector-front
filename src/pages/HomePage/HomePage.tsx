import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/userSlice";
import "./HomePage.css";
import "../../components/global.css";
import { ROUTES } from "../../Routes.tsx";

const MainPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Получаем информацию о пользователе из Redux
    const user = useSelector((state: any) => state.user); // state.user - состояние пользователя в Redux

    // Функция выхода
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/user/logout", {
                method: "POST",
                headers: {
                    "Authorization": `${user.token}`, // Используем токен из состояния
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
        <main className="main-container">
        <div className="home-body">
            <h1 className="home-title">Проверка кода</h1>
            <p className="home-desc">Выберите языки, добавьте код, и вскоре преподаватель по достоинству оценит его.</p>
            <div className="button-group">
            {user.profile.name ? (
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
