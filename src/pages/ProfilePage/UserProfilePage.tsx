import React, { useEffect, useState } from 'react';
import './UserProfilePage.css';
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs.tsx";
import { ROUTE_LABELS, ROUTES } from "../../Routes.tsx";

type User = {
name: string;
email: string;
accountStatus: string;
joinedDate: string;
};

const UserProfilePage: React.FC = () => {
	const [user, setUser] = useState<User>({
		name: 'John Doe',
		email: 'johndoe@example.com',
		accountStatus: 'Active',
		joinedDate: '2024-01-15',
	});

	const [editMode, setEditMode] = useState<boolean>(false);
	const [updatedUser, setUpdatedUser] = useState<User>({ ...user });
	const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
	const [newPassword, setNewPassword] = useState<string>('');

	useEffect(() => {
		setTimeout(() => {
		setUser({
			name: 'John Doe',
			email: 'johndoe@example.com',
			accountStatus: 'Active',
			joinedDate: '2024-01-15',
		});
		setUpdatedUser({
			name: 'John Doe',
			email: 'johndoe@example.com',
			accountStatus: 'Active',
			joinedDate: '2024-01-15',
		});
		}, 1000);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
	};

	const handleSave = () => {
		setUser(updatedUser);
		setEditMode(false);
	};

	const handleResetPassword = () => {
		console.log('Новый пароль:', newPassword);
		setIsResetModalOpen(false);
	};

	const breadcrumbsData = [
			{ label: ROUTE_LABELS.LIST, path: ROUTES.LIST },
			{ label: ROUTE_LABELS.PROFILE, path: ROUTES.PROFILE }
		];

	return (
		<div className="body">
			<div className="user-profile-container">
			<BreadCrumbs crumbs={breadcrumbsData} />
			<h1 className="profile-title">Личный кабинет</h1>
			
			<div className="user-profile">
				<div className="profile-item">
				<label>Имя:</label>
				{editMode ? (
					<input type="text" name="name" value={updatedUser.name} onChange={handleInputChange} />
				) : (
					<span>{user.name}</span>
				)}
				</div>

				<div className="profile-item">
				<label>Email:</label>
				{editMode ? (
					<input type="email" name="email" value={updatedUser.email} onChange={handleInputChange} />
				) : (
					<span>{user.email}</span>
				)}
				</div>

				<div className="profile-item">
				<label>Статус аккаунта:</label>
				<span>{user.accountStatus}</span>
				</div>

				<div className="profile-item">
				<label>Дата регистрации:</label>
				<span>{user.joinedDate}</span>
				</div>

				<div className="profile-buttons">
				{editMode ? (
					<>
					<button className="save-btn" onClick={handleSave}>Сохранить</button>
					<button className="cancel-btn" onClick={() => setEditMode(false)}>Отмена</button>
					</>
				) : (
					<button className="edit-btn" onClick={() => setEditMode(true)}>Редактировать</button>
				)}

				<button className="reset-btn" onClick={() => setIsResetModalOpen(true)}>Сбросить пароль</button>
				</div>
			</div>

			{/* Модальное окно для сброса пароля */}
			{isResetModalOpen && (
				<div className="modal-overlay">
				<div className="modal-content">
					<h2>Сброс пароля</h2>
					<input 
					type="password" 
					placeholder="Введите новый пароль"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					/>
					<div className="modal-buttons">
					<button className="save-btn" onClick={handleResetPassword}>Сохранить</button>
					<button className="cancel-btn" onClick={() => setIsResetModalOpen(false)}>Отмена</button>
					</div>
				</div>
				</div>
			)}
			</div>
		</div>
	);
};

export default UserProfilePage;
