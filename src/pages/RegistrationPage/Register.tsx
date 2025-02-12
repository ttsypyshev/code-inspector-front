import "./Register.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes.tsx";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("User Registered:", formData);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Регистрация</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <input
                        type="text"
                        name="username"
                        placeholder="Имя пользователя"
                        value={formData.username}
                        onChange={handleChange}
                        className="register-input"
                        required
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
