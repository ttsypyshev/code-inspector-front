import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import './Projects.css';
import Header from "../../components/Header/header.tsx";
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

    return (
        <div className="body">
            <Header
                showBreadCrumbs={true}
                showBurgerMenu={true}
                crumbs={[{ label: ROUTE_LABELS.LIST, path: ROUTES.LIST }]}
                showProfileMenu={false}
                showHistory={false}
            />
            <h1>Список заявок</h1>
            <div className="filters">
                <div className="filter-item">
                    <label>Дата начала:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="filter-item">
                    <label>Дата окончания:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="filter-item">
                    <label>Статус:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="draft">Черновик</option>
                        <option value="deleted">Удалёно</option>
                        <option value="completed">Принято</option>
                        <option value="rejected">Отклонено</option>
                        <option value="all">Все</option>
                    </select>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Дата создания</th>
                        <th>Дата формирования</th>
                        <th>Дата завершения</th>
                        <th>Статус</th>
                        <th>Модератор</th>
                        <th>Комментарий</th>
                        <th>Ссылка</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.CreationTime}</td>
                            <td>{project.FormationTime}</td>
                            <td>{project.CompletionTime}</td>
                            <td>{project.Status}</td>
                            <td>{project.Moderator}</td>
                            <td>{project.ModeratorComment}</td>
                            <td>
                                <Link to={`${ROUTES.PROJECT}${project.id}`}>Перейти</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectsPage;