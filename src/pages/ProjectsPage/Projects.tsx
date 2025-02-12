import React, { useEffect, useState } from 'react';
import './Projects.css';

type Application = {
    id: number;
    name: string;
    status: string;
    date: string;
};

const ApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simulating data fetch (You can replace this with an actual API request)
        setTimeout(() => {
        setApplications([
            { id: 1, name: 'Application 1', status: 'Pending', date: '2025-02-01' },
            { id: 2, name: 'Application 2', status: 'Approved', date: '2025-02-05' },
            { id: 3, name: 'Application 3', status: 'Rejected', date: '2025-02-10' },
        ]);
        setLoading(false);
        }, 2000);
    }, []);

    return (
        <div className="body">
            <div className="applications-container">
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="applications-table">
                <h1 className="page-title">User Applications</h1>
                <table className="applications-table-content">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map((app) => (
                        <tr key={app.id}>
                        <td>{app.id}</td>
                        <td>{app.name}</td>
                        <td>{app.status}</td>
                        <td>{app.date}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </div>
    );
};

export default ApplicationsPage;
