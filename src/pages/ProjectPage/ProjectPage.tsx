import React, { useState } from "react";
import "./ProjectPage.css";

const ProjectPage: React.FC = () => {
    const [files, setFiles] = useState([
        { id: 1, lang: "TypeScript", code: "// Ваш код здесь", icon: "/static/img/typescript-icon.png" },
        { id: 2, lang: "CSS", code: "/* Ваши стили здесь */", icon: "/static/img/css-icon.png" },
    ]);

    const [projectInfo] = useState({ id: 12345, creationDate: "2024-02-12" });

    const handleCodeChange = (id: number, newCode: string) => {
        setFiles(files.map(file => (file.id === id ? { ...file, code: newCode } : file)));
    };

    return (
        <div className="writing-code">
        <header className="header">
            <a href="/home" className="background-btn-back" aria-label="Вернуться на главную">
            <img className="icon-btn-back" src="/static/img/icon-btn-back.png" alt="Назад" />
            </a>
        </header>

        <div className="tree">
            <div className="info-box">
            <h2>Проект №{projectInfo.id}</h2>
            <p>Дата создания: {projectInfo.creationDate}</p>
            <button className="project-btn delete-project-btn">Удалить проект</button>
            </div>

            <ul>
            {files.map(file => (
                <li key={file.id} className="code">
                <div className="lang-container">
                    <img className="icon-lang" src={file.icon} alt={file.lang} />
                    <div className="text-lang">{file.lang}</div>
                </div>
                <div className="background-code">
                    <div className="text-lines">{Array.from({ length: 35 }, (_, i) => i + 1).join("\n")}</div>
                    <textarea
                    className="field-write-code"
                    value={file.code}
                    onChange={e => handleCodeChange(file.id, e.target.value)}
                    placeholder="Введите код здесь..."
                    />
                    <div className="text-tech-info">Ln 20, Col 15, Space: 4</div>
                </div>
                </li>
            ))}
            </ul>
        </div>
        </div>
    );
};

export default ProjectPage;
