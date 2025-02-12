import "./RegisterPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../Routes.tsx";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        name: "", // новое поле для имени
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    login: formData.username,
                    password: formData.password,
                    name: formData.name, // передаем имя, если оно указано
                }),
            });

            if (response.ok) {
                navigate(ROUTES.AUTH);
            } else {
                setError("Произошла ошибка при регистрации");
            }
        } catch (err) {
            setError("Не удалось подключиться к серверу. Попробуйте позже.");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Регистрация</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="register-form">
                    <input
                        type="text"
                        name="username"
                        placeholder="Логин"
                        value={formData.username}
                        onChange={handleChange}
                        className="register-input"
                        required
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Ваше имя (необязательно)"
                        value={formData.name}
                        onChange={handleChange}
                        className="register-input"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="register-input"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={handleChange}
                        className="register-input"
                        required
                    />
                    <button type="submit" className="register-button">Зарегистрироваться</button>
                </form>
                <p className="register-login-text">
                    Уже есть аккаунт? <Link to={ROUTES.AUTH} className="login-link">Войдите</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
