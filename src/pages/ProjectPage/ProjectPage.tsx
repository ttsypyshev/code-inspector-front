import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useSelector, useDispatch } from 'react-redux';
import { setProjectID } from '../../store/slices/userSlice';
import { RootState } from "../../store/store";
import "./ProjectPage.css";
import Header from "../../components/Header/Header.tsx";
import { ROUTE_LABELS, ROUTES } from "../../Routes.tsx";
import axios from 'axios';

const formatDate = (isoString: string | null) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const ProjectPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const [files, setFiles] = useState<any[]>([]); 
    const [projectInfo, setProjectInfo] = useState({
        id: 0, 
        creationDate: "", 
        formationDate: "",
        status: "",
        moderatorId: "",
        moderatorComment: "",
    });
    const token = useSelector((state: RootState) => state.user.token);
    const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
    const [errorMessage, setErrorMessage] = useState<string | null>(null); 
    const [successMessage, setSuccessMessage] = useState<string | null>(null); 
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Use navigate hook

    useEffect(() => {
        const fetchProjectData = async () => {
          try {
            const response = await axios.get(
              `http://10.0.2.2:3000/api/project/${id}`,
              {
                headers: {
                  "Authorization": `${token}`,
                },
                timeout: 5000, // Тайм-аут 5 секунд
              }
            );
        
            const data = response.data;
        
            setProjectInfo({
              id: data.project.ID,
              creationDate: formatDate(data.project.CreationTime),
              formationDate: formatDate(data.project.FormationTime),
              status: data.project.Status,
              moderatorId: data.project.ModeratorID,
              moderatorComment: data.project.ModeratorComment,
            });
        
            const updatedFiles = data.files.map((file: any) => ({
              id: file.ID,
              langId: file.Lang.ID,
              lang: file.Lang.Name,
              code: file.Code,
              icon: file.Lang.ImgLink,
            }));
        
            setFiles(updatedFiles);
            console.log("Файлы проекта:", updatedFiles);
          } catch (error) {
            console.error("Ошибка при загрузке данных проекта", error);
          }
        };

        fetchProjectData();
    }, [id, token]);

    const handleCodeChange = (id: number, newCode: string) => {
        setFiles(files.map(file => (file.id === id ? { ...file, code: newCode } : file)));
    };

    const handleCursorMove = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        let cursorPos = e.currentTarget.selectionStart;
        const lines = e.currentTarget.value.split("\n");
        let line = 0;
        let col = 0;
    
        for (let i = 0; i < lines.length; i++) {
            const lineLength = lines[i].length + 1; 
            if (cursorPos < lineLength) {
                line = i + 1;
                col = cursorPos + 1;
                break;
            }
            cursorPos -= lineLength;
        }
    
        setCursorPosition({ line, col });
    };

    const handleSubmitProject = async () => {
      const fileCodes: { [key: string]: string } = {};
      files.forEach((file) => {
        fileCodes[file.id] = file.code;
      });
    
      try {
        const response = await axios.put(
          `http://10.0.2.2:3000/api/project/${id}/submit`,
          { file_codes: fileCodes },
          {
            headers: {
              "Authorization": `${token}`,
              "Content-Type": "application/json",
            },
            timeout: 5000, // Тайм-аут 5 секунд
          }
        );
    
        if (response.status === 200) {
          dispatch(setProjectID(null));
          setSuccessMessage("Проект успешно сохранен!");
          setErrorMessage(null);
          navigate(ROUTES.LIST); // Redirect to the list page after successful submission
        } else {
          setErrorMessage(response.data.message || "Ошибка при сохранении проекта");
          setSuccessMessage(null);
        }
      } catch (error) {
        console.error("Ошибка при отправке проекта", error);
        setErrorMessage("Произошла ошибка при сохранении проекта");
        setSuccessMessage(null);
      }
    };

    const handleDeleteProject = async () => {
      try {
        const response = await axios.delete(
          `http://10.0.2.2:3000/api/project/${id}`,
          {
            headers: {
              "Authorization": `${token}`,
            },
            timeout: 5000, // Тайм-аут 5 секунд
          }
        );
    
        if (response.status === 200) {
          dispatch(setProjectID(null));
          setSuccessMessage("Проект успешно удален!");
          setErrorMessage(null);
          navigate(ROUTES.LIST); // Redirect to the list page after successful deletion
        } else {
          setErrorMessage("Невозможно удалить проект");
          setSuccessMessage(null);
        }
      } catch (error) {
        console.error("Ошибка при удалении проекта", error);
        setErrorMessage("Произошла ошибка при удалении проекта");
        setSuccessMessage(null);
      }
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
                    showEdit={false}
                />
                <div className="tree">
                    <div className="info-box">
                    <h2 className="project-title">Проект №{projectInfo.id}</h2>
                    <p className="project-info">Дата создания: {projectInfo.creationDate}</p>
                    <p className="project-info">Дата формирования: {projectInfo.formationDate || "Не указана"}</p>
                    <p className="project-info">Статус: {projectInfo.status}</p>
                    <p className="project-info">Комментарий модератора: {projectInfo.moderatorComment || "Нет комментариев"}</p>
                    <div className="project-buttons">
                    {projectInfo.formationDate === '—' && (
                            <>
                                <button className="project-btn save-project-btn" onClick={handleSubmitProject}>Отправить проект</button>
                                <button className="project-btn delete-project-btn" onClick={handleDeleteProject}>Удалить проект</button>
                            </>
                        )}
                    </div>
                        {successMessage && <div className="success-message">{successMessage}</div>} 
                        {errorMessage && <div className="error-message">{errorMessage}</div>} 
                    </div>
                    <ul>
                        {files.map(file => (
                            <li key={file.id} className="code">
                                <div className="lang-container">
                                    <img className="icon-lang" src={`/img-proxy/code-inspector/${file.langId}.png`} alt={file.lang} />
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
                                            onSelect={handleCursorMove}
                                            placeholder="Введите код здесь..."
                                            wrap="soft"
                                            rows={file.code.split("\n").length || 1}
                                        />
                                    </div>
                                    <div className="text-tech-info">
                                        Ln {cursorPosition.line}, Col {cursorPosition.col}
                                    </div>
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
