import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // для получения id из URL
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import "./ProjectPage.css";
import Header from "../../components/Header/Header.tsx";
import { ROUTE_LABELS, ROUTES } from "../../Routes.tsx";

const ProjectPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Извлекаем id из URL
    const [files, setFiles] = useState<any[]>([]); // Состояние для файлов
    const [projectInfo, setProjectInfo] = useState({ id: 0, creationDate: "" }); // Состояние для информации о проекте
    const token = useSelector((state: RootState) => state.user.token);

    useEffect(() => {
        // Загружаем данные проекта и файлов с сервера
        const fetchProjectData = async () => {
            try {
                const response = await fetch(`/api/project/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `${token}`,
                    },
                });
                const data = await response.json();

                // Обновляем состояние проектной информации
                setProjectInfo({
                    id: data.project.ID,
                    creationDate: data.project.CreationTime,
                });

                // Обновляем состояние файлов с языковыми данными
                const updatedFiles = data.files.map((file: any) => ({
                    id: file.ID,
                    lang: file.Lang.Name,
                    code: file.Code,
                    icon: file.Lang.ImgLink,
                }));

                setFiles(updatedFiles);
            } catch (error) {
                console.error("Ошибка при загрузке данных проекта", error);
            }
        };

        fetchProjectData();
    }, [id]); // Перезапускать запрос при изменении id в URL

    const handleCodeChange = (id: number, newCode: string) => {
        setFiles(files.map(file => (file.id === id ? { ...file, code: newCode } : file)));
    };

    const breadcrumbsData = [
        { label: ROUTE_LABELS.LIST, path: ROUTES.LIST },
        { label: ROUTE_LABELS.PROJECT, path: ROUTES.PROJECT }
    ];

    return (
        <div className="body">
            <div className="writing-code">
                <Header
                        showBreadCrumbs={true}
                        showBurgerMenu={true}
                        crumbs={breadcrumbsData}
                        showProfileMenu={false}
                        showHistory={false}
                />
                <div className="tree">
                    <div className="info-box">
                        <h2>Проект №{projectInfo.id}</h2>
                        <p>Дата создания: {projectInfo.creationDate}</p>
                        <button className="project-btn save-project-btn">Сохранить проект</button> // UpdateProject Изменить поля заявки по теме.
                        <button className="project-btn save-project-btn">Отправить проект</button> // формировать заявку создателем с установкой даты формирования                                                                 
                        <button className="project-btn delete-project-btn">Удалить проект</button> // DeleteProject Удалить заявку
                    </div>
                    <ul>
                        {files.map(file => (
                            <li key={file.id} className="code">
                            <div className="lang-container">
                                <img className="icon-lang" src={file.icon} alt={file.lang} />
                                <div className="text-lang">{file.lang}</div>
                            </div>
                            <div className="background-code">
                                <div className="code-editor">
                                <div className="line-numbers">
                                    {file.code.split("\n").map((_: string, index: number) => (
                                    <div key={index} className="line-number">
                                        {index + 1}
                                    </div>
                                    ))}
                                </div>
                                <textarea
                                    className="field-write-code"
                                    value={file.code}
                                    onChange={e => handleCodeChange(file.id, e.target.value)}
                                    placeholder="Введите код здесь..."
                                    wrap="soft" // Текст будет переноситься
                                    rows={file.code.split("\n").length || 1} // Автоматический подсчет строк
                                />
                                </div>
                                <div className="text-tech-info">Ln {file.code.split("\n").length}, Col 15, Space: 4</div>
                            </div>
                            </li>
                        ))}
                        </ul>



                </div>
            </div>
        </div>
    );
};

export default ProjectPage;
