import { useState } from "react";
import './StatusModal.css'

interface StatusModalProps {
    isOpen: boolean;
    projectId: number;
    currentStatus: string;
    currentComment: string;
    onClose: () => void;
    onSave: (status: string, comment: string) => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
    isOpen,
    currentStatus,
    currentComment,
    onClose,
    onSave
}) => {
    const [status, setStatus] = useState(currentStatus);
    const [comment, setComment] = useState(currentComment);

    const handleSave = () => {
        onSave(status, comment);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Изменить статус</h2>
                <label>Статус:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="created">Отправлено</option>
                    <option value="completed">Принято</option>
                    <option value="rejected">Отклонено</option>
                </select>

                <label>Комментарий:</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Введите комментарий"
                ></textarea>

                <button onClick={handleSave}>Сохранить</button>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default StatusModal;