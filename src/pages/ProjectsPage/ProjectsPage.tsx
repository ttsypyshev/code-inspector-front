import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { Link } from "react-router-dom";
import './ProjectsPage.css';
import Header from "../../components/Header/Header.tsx";
import { ROUTE_LABELS, ROUTES } from "../../Routes.tsx";
import StatusModal from "../../components/StatusModal/SattusModal.tsx";
import axios from 'axios';

interface Project {
    id: number;
    CreationTime: string;
    FormationTime?: string | null;
    CompletionTime?: string | null;
    CreatorID: string;
    Creator: string;
    Status: string;
    Moderator?: string;
    ModeratorComment?: string | null;
    qr?: string;
}

const formatDate = (isoString: string | null) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const ProjectsPage = () => {
    const token = useSelector((state: RootState) => state.user.token);
    const user = useSelector((state: RootState) => state.user.profile);
    const [projects, setProjects] = useState<Project[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("all");
    const [creatorName, setCreatorName] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [selectedProjectStatus, setSelectedProjectStatus] = useState<string>("");
    const [selectedProjectComment, setSelectedProjectComment] = useState<string>("");

    useEffect(() => {
        if (!token) return;

        const fetchProjects = async () => {
          try {
            const params = new URLSearchParams();
            if (startDate) params.append("start_date", startDate);
            if (endDate) params.append("end_date", endDate);
            if (status !== "all") params.append("status", status);
        
            const response = await axios.get(
              `http://10.0.2.2:3000/api/project?${params.toString()}`,
              {
                headers: { Authorization: token },
              }
            );
        
            if (response.status !== 200) throw new Error("Failed to fetch projects");
        
            const data = response.data;
        
            if (!data.projects || !Array.isArray(data.projects)) {
              console.error("Expected array in 'projects', got:", data);
              throw new Error("Invalid data format");
            }
        
            setProjects(
              data.projects.map((project: any) => ({
                id: project.ID,
                CreatorID: project.UserID,
                Creator: project.User.Name || project.User.login,
                CreationTime: formatDate(project.CreationTime),
                FormationTime: formatDate(project.FormationTime),
                CompletionTime: formatDate(project.CompletionTime),
                Status: project.Status,
                Moderator: project.Moderator ? project.Moderator.name : "—",
                ModeratorComment: project.ModeratorComment || "—",
                qr: project.qr,
              }))
            );
          } catch (error) {
            console.error(error);
            setProjects([]);
          }
        };

        // Start polling every 10 seconds (10000 ms)
        const intervalId = setInterval(fetchProjects, 2000);

        // Cleanup the interval when the component is unmounted or token changes
        return () => clearInterval(intervalId);
    }, [token, startDate, endDate, status]);

    // Фильтруем проекты в зависимости от роли пользователя
    const filteredProjects = projects.filter((project) => {
        if (user.role === "admin") {
            return project.Creator.toLowerCase().includes(creatorName.toLowerCase());
        } else if (user.role === "student") {
            return project.CreatorID === user.id;
        }
        return true;
    });

    const changeStatus = async (status: string, comment: string) => {
      if (!selectedProjectId) return;
    
      try {
        const response = await axios.put(
          `http://10.0.2.2:3000/api/project/${selectedProjectId}/complete`,
          {
            status,
            comment,
          },
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
            timeout: 5000, // Тайм-аут 5 секунд
          }
        );
    
        if (response.status === 200) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === selectedProjectId
                ? { ...project, Status: status, ModeratorComment: comment }
                : project
            )
          );
        } else {
          console.error("Failed to change project status");
        }
      } catch (error) {
        console.error("Ошибка при изменении статуса проекта", error);
      }
    };

    // Открыть модальное окно
    const handleOpenModal = (project: Project) => {
        setSelectedProjectId(project.id);
        setSelectedProjectStatus(project.Status);
        setSelectedProjectComment(project.ModeratorComment || "");
        setModalOpen(true); // Открыть модальное окно
    };

    // Закрыть модальное окно
    const handleCloseModal = () => {
        setModalOpen(false); // Закрыть модальное окно
    };

    const breadcrumbsData = [
        { label: ROUTE_LABELS.LIST, path: ROUTES.LIST },
        { label: ROUTE_LABELS.PROJECTS, path: ROUTES.PROJECT }
    ];

    return (
        <div className="body">
            <div className="page-body">
                <Header
                    showBreadCrumbs={true}
                    showBurgerMenu={true}
                    crumbs={breadcrumbsData}
                    showProfileMenu={false}
                    showHistory={false}
                    showEdit={false}
                />
                <h1 className="page-title">Список заявок</h1>
                <div className="filter-container">
                    <div className="filter-item">
                        <label className="filter-label">Дата начала:</label>
                        <input
                            type="date"
                            className="filter-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="filter-item">
                        <label className="filter-label">Дата окончания:</label>
                        <input
                            type="date"
                            className="filter-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="filter-item">
                        <label className="filter-label">Статус:</label>
                        <select
                            className="filter-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="draft">Черновик</option>
                            <option value="created">Отправлено</option>
                            <option value="completed">Принято</option>
                            <option value="rejected">Отклонено</option>
                            <option value="all">Все</option>
                        </select>
                    </div>
                    {user.role === "admin" && (
                        <div className="filter-item">
                            <label className="filter-label">Создатель:</label>
                            <input
                                type="text"
                                className="filter-input"
                                value={creatorName}
                                onChange={(e) => setCreatorName(e.target.value)}
                                placeholder="Введите имя создателя"
                            />
                        </div>
                    )}
                </div>
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            <th className="table-header-cell">Дата создания</th>
                            <th className="table-header-cell">Дата формирования</th>
                            <th className="table-header-cell">Дата завершения</th>
                            <th className="table-header-cell">Создатель</th>
                            <th className="table-header-cell">Статус</th>
                            <th className="table-header-cell">Модератор</th>
                            <th className="table-header-cell">Комментарий</th>
                            <th className="table-header-cell">Ссылка</th>
                            {user.role === "admin" && ( <th className="table-header-cell">Оценка</th> )}
                            <th className="table-header-cell">QR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map((project) => (
                            <tr className="table-row" key={project.id}>
                                <td className="table-cell">{project.CreationTime}</td>
                                <td className="table-cell">{project.FormationTime}</td>
                                <td className="table-cell">{project.CompletionTime}</td>
                                <td className="table-cell">{project.Creator}</td>
                                <td className="table-cell">{project.Status}</td>
                                <td className="table-cell">{project.Moderator}</td>
                                <td className="table-cell">{project.ModeratorComment}</td>
                                <td className="table-cell">
                                    <Link className="link" to={`${ROUTES.PROJECT}${project.id}`}>
                                        Перейти
                                    </Link>
                                </td>
                                {user.role === "admin" && ( <td className="table-cell">
                                        <button
                                            className="action-button"
                                            onClick={() => handleOpenModal(project)} // Открытие модального окна
                                        >
                                            Изменить статус
                                        </button>
                                    </td>
                                )}
                                <td className="table-cell">
                                    {!project.qr ? (
                                        <img className="status-icon" src="/img/time.svg" alt="Time Icon" />
                                    ) : (
                                        <div className="qr-hover-wrapper">
                                            <img className="status-icon" src="/img/qr.svg" alt="QR Icon" />
                                            <div className="qr-hover">
                                                <img className="qr-code" src={`data:image/png;base64,${project.qr}`} alt="QR Code" />
                                                <p>Проект №{project.id}</p>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Модальное окно */}
            <StatusModal
                isOpen={modalOpen}
                projectId={selectedProjectId || 0}
                currentStatus={selectedProjectStatus}
                currentComment={selectedProjectComment}
                onClose={handleCloseModal}
                onSave={changeStatus}
            />
        </div>
    );
};

export default ProjectsPage;
