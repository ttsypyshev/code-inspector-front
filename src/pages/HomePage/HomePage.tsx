import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./HomePage.css";
import "../../components/global.css";
import { ROUTES } from "../../Routes.tsx";

const MainPage: React.FC = () => {
    return (
        <main className="main-container">
            <div className="home-body">
                <h1 className="home-title">Проверка кода</h1>
                <p className="home-desc">
                    Выберите языки, добавьте код, и вскоре преподаватель по достоинству оценит его.
                </p>
                <div className="button-group">
                    <Link to={ROUTES.LIST}>
                        <Button variant="outline-light" className="btn-resume">
                            Продолжить как гость
                        </Button>
                    </Link>
                    <Link to={ROUTES.AUTH}>
                        <Button variant="outline-light" className="btn-login">
                            Войти
                        </Button>
                    </Link>
                    <Link to={ROUTES.REG}>
                        <Button variant="outline-light" className="btn-register">
                            Регистрация
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default MainPage;
