import React, { useEffect, useState } from 'react';
import './UserProfilePage.css';
import Header from "../../components/Header/Header.tsx";
import { ROUTE_LABELS, ROUTES } from "../../Routes.tsx";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store.ts';
import { setUser } from '../../store/slices/userSlice';
import axios from 'axios';

type User = {
	id: string;
	username: string;
	name: string;
	email: string;
	role: string;
}

const UserProfilePage: React.FC = () => {
	const dispatch = useDispatch();
	const user = useSelector((state: RootState) => state.user.profile);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [updatedUser, setUpdatedUser] = useState<User | null>(null);
	const [error, setError] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const token = useSelector((state: RootState) => state.user.token);

	useEffect(() => {
		console.log("123", user)
		if (!user) {
			setError("Ошибка: Пользователь не найден. Пожалуйста, войдите в систему.");
		} else {
			setUpdatedUser(user as User);
		}
	}, [dispatch, user]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedUser({ ...updatedUser!, [e.target.name]: e.target.value });
	};

	const handleSave = async () => {
	  if (updatedUser) {
		try {
		  const response = await axios.put(
			'http://10.0.2.2:3000/api/user/update',
			{
			  name: updatedUser.name || '',
			  email: updatedUser.email || '',
			  password: newPassword || '',
			},
			{
			  headers: {
				'Content-Type': 'application/json',
				"Authorization": `${token}`,
			  },
			  timeout: 5000, // Тайм-аут 5 секунд
			}
		  );
	
		  if (response.status !== 200) {
			throw new Error('Ошибка при обновлении данных пользователя');
		  }
	
		  dispatch(setUser(updatedUser));
	
		  alert('Данные пользователя успешно обновлены');
	
		  setEditMode(false);
		  setNewPassword('');
		} catch (error) {
		  setError('Произошла ошибка при сохранении');
		}
	  } else {
		setError('Пожалуйста, заполните все поля.');
	  }
	};

	const breadcrumbsData = [
		{ label: ROUTE_LABELS.LIST, path: ROUTES.LIST },
		{ label: ROUTE_LABELS.PROFILE, path: ROUTES.PROFILE }
	];

	return (
		<div className="body">
			<div className="user-profile-container">
				<Header
							showBreadCrumbs={true}
							showBurgerMenu={true}
							crumbs={breadcrumbsData}
							showProfileMenu={false}
							showHistory={false}
							showEdit={false}
				/>
				<h1 className="profile-title">Личный кабинет</h1>

				{error && <div className="error-message">{error}</div>}

				<div className="user-profile">
					{/* Editable fields: name and email */}
					{['name', 'email'].map(field => (
						<div className="profile-item" key={field}>
							<label>{field === 'name' ? 'Имя' : 'Email'}:</label>
							{editMode ? (
								<input 
									type={field === 'email' ? 'email' : 'text'} 
									name={field} 
									value={updatedUser?.[field as keyof User]} 
									onChange={handleInputChange} 
								/>
							) : (
								<span>{user?.[field as keyof User]}</span>
							)}
						</div>
					))}

					{/* Editable password field */}
					{editMode && (
						<div className="profile-item">
							<label>Новый пароль:</label>
							<input 
								type="password" 
								placeholder="Введите новый пароль" 
								value={newPassword} 
								onChange={(e) => setNewPassword(e.target.value)} 
							/>
						</div>
					)}

					<div className="profile-buttons">
						{editMode ? (
							<>
								<button className="save-btn" onClick={handleSave}>Сохранить</button>
								<button className="cancel-btn" onClick={() => setEditMode(false)}>Отмена</button>
							</>
						) : (
							<button className="edit-btn" onClick={() => setEditMode(true)}>Редактировать</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfilePage;
