import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser, setToken } from "../../store/slices/userSlice";
import { ROUTES } from "../../Routes.tsx";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Хук для редиректа

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            // Запрос на сервер для получения токена
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    login: formData.username,  // Используем login вместо username
                    password: formData.password,
                }),
                signal: AbortSignal.timeout(5000), // Таймаут для запроса
            });
    
            if (!response.ok) {
                throw new Error("Неверный юзернейм или пароль");
            }
    
            // Если запрос успешен, получаем токен и данные пользователя
            const data = await response.json();
            const { access_token, token_type, user } = data;
    
            // Сохраняем токен в Redux
            dispatch(setToken(`${token_type} ${access_token}`));

            // Сохраняем данные пользователя
            dispatch(setUser({
                username: user.login,   // Используем login вместо username
                name: user.name,
                id: user.id,
                email: user.email,
                role: user.role,
            }));
    
            // Редирект на другую страницу (например, на главную)
            navigate(ROUTES.LIST);  // Замените ROUTES.LIST на нужный маршрут

        } catch (error) {
            setError("Неверный юзернейм или пароль");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Вход</h2>
                {error && <p className="login-error">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        name="username" // Изменено на username
                        placeholder="Юзернейм"
                        value={formData.username}  // Используем username
                        onChange={handleChange}
                        className="login-input"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        className="login-input"
                        required
                    />
                    <button type="submit" className="login-button">Войти</button>
                </form>
                <p className="login-register-text">
                    Нет аккаунта? <Link to={ROUTES.REG} className="register-link">Зарегистрируйтесь</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
