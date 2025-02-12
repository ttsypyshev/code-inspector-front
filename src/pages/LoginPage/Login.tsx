import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Routes.tsx";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Пример обработки ошибки
        if (formData.email !== "test@example.com" || formData.password !== "password123") {
            setError("Неверный email или пароль");
            return;
        }
        
        setError("");
        console.log("User Logged In:", formData);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Вход</h2>
                {error && <p className="login-error">{error}</p>}
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
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
