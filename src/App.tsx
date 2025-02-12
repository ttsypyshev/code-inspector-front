import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages/HomePage/HomePage"
import LangListPage from "./pages/LangsListPage/LangListPage"
import LangPage from "./pages/LangPage/LangPage";
import { ROUTES } from "./Routes";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from 'react';


function App() {
    useEffect(()=>{
        invoke('tauri', {cmd:'create'})
            .then(() =>{console.log("Tauri launched")})
            .catch(() =>{console.log("Tauri not launched")})
        return () =>{
            invoke('tauri', {cmd:'close'})
            .then(() =>{console.log("Tauri launched")})
            .catch(() =>{console.log("Tauri not launched")})
        }
    }, [])

    return (
        <BrowserRouter basename='/code-inspector-front'>
            <Routes>
                <Route path={ROUTES.HOME} element={<MainPage/>} />
                <Route path={ROUTES.LIST} element={<LangListPage/>} />
                <Route path={`${ROUTES.LANG}:id`} element={<LangPage/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;