export const ROUTES = {
    HOME: "/",
    LIST: "/info",
    LANG: "/lang/",
    REG: "/reg/",
    AUTH: "/login/",
    PROFILE: "/profile/",
    PROJECTS: "/projects/",
    PROJECT: "/project/",
    EDIT: "/edit/",
}

export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    HOME: "Главная",
    LIST: "Языки",
    LANG: "Язык",
    REG: "Регистрация",
    AUTH: "Авторизация",
    PROFILE: "Профиль",
    PROJECTS: "Проекты",
    PROJECT: "Проект",
    EDIT: "Редактирование",
};