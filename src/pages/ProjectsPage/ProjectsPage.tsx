import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { Link } from "react-router-dom";
import './ProjectsPage.css';
import Header from "../../components/Header/Header.tsx";
import { ROUTE_LABELS, ROUTES } from "../../Routes.tsx";

interface Project {
    id: number;
    CreationTime: string;
    FormationTime?: string | null;
    CompletionTime?: string | null;
    Status: string;
    Moderator?: string;
    ModeratorComment?: string | null;
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
    const [projects, setProjects] = useState<Project[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("all");

    useEffect(() => {
        if (!token) return;

        const fetchProjects = async () => {
            try {
                const params = new URLSearchParams();
                if (startDate) params.append("start_date", startDate);
                if (endDate) params.append("end_date", endDate);
                if (status !== "all") params.append("status", status);

                const response = await fetch(`/api/project?${params.toString()}`, {
                    headers: { Authorization: token },
                });

                if (!response.ok) throw new Error("Failed to fetch projects");

                const data = await response.json();

                if (!data.projects || !Array.isArray(data.projects)) {
                    console.error("Expected array in 'projects', got:", data);
                    throw new Error("Invalid data format");
                }
                
                setProjects(
                    data.projects.map((project: any) => ({
                        id: project.ID,
                        CreationTime: formatDate(project.CreationTime),
                        FormationTime: formatDate(project.FormationTime),
                        CompletionTime: formatDate(project.CompletionTime),
                        Status: project.Status,
                        Moderator: project.Moderator ? project.Moderator.name : "—",
                        ModeratorComment: project.ModeratorComment || "—",
                    }))
                );
            } catch (error) {
                console.error(error);
                setProjects([]);
            }
        };

        fetchProjects();
    }, [token, startDate, endDate, status]);

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
                </div>
                <table className="table">
                    <thead className="table-header">
                        <tr>
                            <th className="table-header-cell">Дата создания</th>
                            <th className="table-header-cell">Дата формирования</th>
                            <th className="table-header-cell">Дата завершения</th>
                            <th className="table-header-cell">Статус</th>
                            <th className="table-header-cell">Модератор</th>
                            <th className="table-header-cell">Комментарий</th>
                            <th className="table-header-cell">Ссылка</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr className="table-row" key={project.id}>
                                <td className="table-cell">{project.CreationTime}</td>
                                <td className="table-cell">{project.FormationTime}</td>
                                <td className="table-cell">{project.CompletionTime}</td>
                                <td className="table-cell">{project.Status}</td>
                                <td className="table-cell">{project.Moderator}</td>
                                <td className="table-cell">{project.ModeratorComment}</td>
                                <td className="table-cell">
                                    <Link className="link" to={`${ROUTES.PROJECT}${project.id}`}>
                                        Перейти
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsPage;
