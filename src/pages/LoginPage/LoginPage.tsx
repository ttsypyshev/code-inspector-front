import "./LoginPage.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser, setToken } from "../../store/slices/userSlice.ts";
import { ROUTES } from "../../Routes.tsx";
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const requestData = {
            login: formData.username,
            password: formData.password,
        };
        
        console.log("Отправляемый JSON:", JSON.stringify(requestData));
        
        try {
            const response = await axios.post(
                "http://10.0.2.2:3000/api/user/login",
                requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    timeout: 5000,
                }
            );            
            
            console.log("Принимаемый json:", JSON.stringify(response.data))
                
            const { access_token, token_type, user } = response.data;
    
            dispatch(setToken(`${token_type} ${access_token}`));
    
            dispatch(
                setUser({
                    username: user.login,
                    name: user.name,
                    id: user.id,
                    email: user.email,
                    role: user.role,
                })
            );

            navigate(ROUTES.LIST); // Укажите нужный маршрут
        } catch (error) {
            console.error("Ошибка авторизации:", error);
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
                        placeholder="Логин"
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
