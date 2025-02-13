import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Header from "../../components/Header/Header.tsx";
import { ROUTE_LABELS, ROUTES } from "../../Routes.tsx";
import './EditLangsPage.css'

interface Language {
  id: number;
  name: string;
  short_description: string;
  description: string;
  img_link: string;
  author: string;
  year: string;
  version: string;
  list?: Record<string, string>;
}

const EditLanguagesPage = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [newLanguage, setNewLanguage] = useState<Partial<Language>>({});
  const [editingLanguage, setEditingLanguage] = useState<Partial<Language> | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAddLanguageModalOpen, setIsAddLanguageModalOpen] = useState(false);
  const [isEditLanguageModalOpen, setIsEditLanguageModalOpen] = useState(false);
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
  
  const [listText, setListText] = useState(""); // Состояние для строки с JSON
  const [jsonError, setJsonError] = useState<string | null>(null); // Состояние для ошибки парсинга JSON

  useEffect(() => {
    if (!token) return;

    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/info", {
          headers: { Authorization: `${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch languages");
        const data = await response.json();
        console.log("Fetched data:", data);

        const transformedLanguages = data.langs.map((lang: any) => ({
          id: lang.ID,
          name: lang.Name,
          short_description: lang.ShortDescription,
          description: lang.Description,
          img_link: lang.ImgLink,
          author: lang.Author,
          year: lang.Year,
          version: lang.Version,
          list: lang.List || {},
        }));

        setLanguages(transformedLanguages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLanguages();
  }, [token]);

  const handleAddLanguage = async () => {
    // Set default listText if it's empty
    if (!newLanguage.list) {
      setListText('{}');
      newLanguage.list = {}; // Add default list if it wasn't provided
    }
  
    if (!newLanguage.name || !newLanguage.short_description || !newLanguage.description) return;
  
    try {
      const response = await fetch("/api/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(newLanguage),
      });
      if (!response.ok) throw new Error("Не удалось добавить язык. Попробуйте позже.");
      const addedLanguage = await response.json();
      setLanguages([...languages, addedLanguage]);
      setNewLanguage({});
      closeAddLanguageModal();
    } catch (error) {
      setJsonError("Ошибка"); // Устанавливаем глобальную ошибку
      console.error(error);
    }
  };
  
  

  const handleEditLanguage = async () => {
    if (!editingLanguage || !editingLanguage.id) return;

    // Парсим listText перед сохранением
    let parsedList = {};
    if (listText.trim() !== "") {
      try {
        parsedList = JSON.parse(listText);
        setJsonError(null); // Сбрасываем ошибку, если JSON успешно распарсен
      } catch (err) {
        setJsonError("Неверный формат JSON. Пожалуйста, проверьте синтаксис.");
        return; // Не продолжаем выполнение, пока ошибка не будет исправлена
      }
    }

    const updatedLanguage = { ...editingLanguage, list: parsedList };

    try {
      const response = await fetch(`/api/info/${editingLanguage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(updatedLanguage),
      });
      if (!response.ok) throw new Error("Не удалось обновить язык. Пожалуйста, попробуйте снова.");
      setLanguages(languages.map(lang =>
        lang.id === editingLanguage.id ? { ...lang, ...updatedLanguage } : lang
      ));
      setEditingLanguage(null);
      closeEditLanguageModal();
    } catch (error) {
      setJsonError("Oшибка"); // Если ошибка в запросе
      console.error(error);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage || selectedLanguageId === null) return;
    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      const response = await fetch(`/api/info/${selectedLanguageId}`, {
        method: "POST",
        headers: { Authorization: `${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload image");
      setSelectedImage(null);
      closeUploadImageModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteLanguage = async (id: number) => {
    try {
      const response = await fetch(`/api/info/${id}`, {
        method: "DELETE",
        headers: { Authorization: `${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete language");
      setLanguages(languages.filter(lang => lang.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const openAddLanguageModal = () => {
    setNewLanguage({});
    setIsAddLanguageModalOpen(true);
    setIsEditLanguageModalOpen(false);
  };

  const closeAddLanguageModal = () => {
    setIsAddLanguageModalOpen(false);
  };

  const openEditLanguageModal = (lang: Language) => {
    setEditingLanguage({ ...lang });
    setListText(
      lang.list && Object.keys(lang.list).length > 0
        ? JSON.stringify(lang.list, null, 2)
        : ""
    );
    setJsonError(null); // Очищаем ошибку при открытии модального окна
    setIsEditLanguageModalOpen(true);
    setIsAddLanguageModalOpen(false);
  };

  const closeEditLanguageModal = () => {
    setIsEditLanguageModalOpen(false);
    setEditingLanguage(null);
  };

  const openUploadImageModal = (id: number) => {
    setSelectedLanguageId(id);
    setIsUploadImageModalOpen(true);
  };

  const closeUploadImageModal = () => {
    setIsUploadImageModalOpen(false);
    setSelectedLanguageId(null);
  };

  const breadcrumbsData = [
    { label: ROUTE_LABELS.LIST, path: ROUTES.LIST },
    { label: ROUTE_LABELS.EDIT, path: ROUTES.EDIT }
  ];

  return (
    <div className="body">
      <Header
        showBreadCrumbs={true}
        showBurgerMenu={true}
        crumbs={breadcrumbsData}
        showProfileMenu={false}
        showHistory={false}
        showEdit={false}
      />
      <h1 className="page-title">Список языков</h1>
      <button className="button button-add" onClick={openAddLanguageModal}>Добавить язык</button>
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-header-cell">ID</th>
            <th className="table-header-cell">Название</th>
            <th className="table-header-cell">Автор</th>
            <th className="table-header-cell">Год</th>
            <th className="table-header-cell">Версия</th>
            <th className="table-header-cell">Изображение</th>
            <th className="table-header-cell">Действия</th>
          </tr>
        </thead>
        <tbody>
          {languages.length > 0 ? (
            languages.map(lang => (
              <tr className="table-row" key={lang.id}>
                <td className="table-cell">{lang.id}</td>
                <td className="table-cell">{lang.name}</td>
                <td className="table-cell">{lang.author}</td>
                <td className="table-cell">{lang.year}</td>
                <td className="table-cell">{lang.version}</td>
                <td className="table-cell">
                  <img src={lang.img_link} alt={lang.name} className="table-image" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </td>
                <td className="table-cell">
                  <button className="button button-edit" onClick={() => openEditLanguageModal(lang)}>Редактировать</button>
                  <button className="button button-add" onClick={() => openUploadImageModal(lang.id)}>Загрузить изображение</button>
                  <button className="button button-delete" onClick={() => handleDeleteLanguage(lang.id)}>Удалить</button>

                </td>
              </tr>
            ))
          ) : (
            <tr className="table-row"><td className="table-cell" colSpan={6}>Нет доступных языков</td></tr>
          )}
        </tbody>
      </table>

      {/* Add Language Modal */}
      {isAddLanguageModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Добавить новый язык</h2>

            <input
              type="text"
              className="input"
              placeholder="Название"
              value={newLanguage?.name || ""}
              onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
              required
            />
            <input
              type="text"
              className="input"
              placeholder="Краткое описание"
              value={newLanguage?.short_description || ""}
              onChange={(e) => setNewLanguage({ ...newLanguage, short_description: e.target.value })}
              required
            />
            <textarea
              className="input"
              placeholder="Описание"
              value={newLanguage?.description || ""}
              onChange={(e) => setNewLanguage({ ...newLanguage, description: e.target.value })}
              required
            />

            {/* Добавляем обработку нажатия кнопки */}
            <button 
              className="button" 
              onClick={() => {
                if (newLanguage?.name && newLanguage?.short_description && newLanguage?.description) {
                  handleAddLanguage();
                } else {
                  alert("Пожалуйста, заполните все поля.");
                }
              }}
            >
              Добавить
            </button>
            <button className="button" onClick={closeAddLanguageModal}>Закрыть</button>
          </div>
        </div>
      )}

      {/* Edit Language Modal */}
      {isEditLanguageModalOpen && editingLanguage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Редактировать язык</h2>

            <input
              type="text"
              className="input"
              placeholder="Название"
              value={editingLanguage?.name || ""}
              onChange={(e) => setEditingLanguage({ ...editingLanguage, name: e.target.value })}
              required
            />
            <input
              type="text"
              className="input"
              placeholder="Краткое описание"
              value={editingLanguage?.short_description || ""}
              onChange={(e) => setEditingLanguage({ ...editingLanguage, short_description: e.target.value })}
              required
            />
            <textarea
              className="input"
              placeholder="Описание"
              value={editingLanguage?.description || ""}
              onChange={(e) => setEditingLanguage({ ...editingLanguage, description: e.target.value })}
              required
            />

            {/* Дополнительные необязательные поля */}
            <input
              type="text"
              className="input"
              placeholder="Автор"
              value={editingLanguage?.author || ""}
              onChange={(e) => setEditingLanguage({ ...editingLanguage, author: e.target.value })}
            />
            <input
              type="number"
              className="input"
              placeholder="Год"
              value={editingLanguage?.year || ""}
              onChange={(e) => setEditingLanguage({ ...editingLanguage, year: e.target.value })}
            />
            <input
              type="text"
              className="input"
              placeholder="Версия"
              value={editingLanguage?.version || ""}
              onChange={(e) => setEditingLanguage({ ...editingLanguage, version: e.target.value })}
            />

            {/* Лист с данными */}
            <textarea
              className={`input ${jsonError ? "input-error" : ""}`} // Добавляем класс для ошибок
              placeholder="Лист (например, Синтаксис, Типизация и т.д.)"
              value={listText}
              onChange={(e) => setListText(e.target.value)}
            />
            {jsonError && (
              <>
                <div className="error-message">{jsonError}</div>
                {console.log("Displaying error message:", jsonError)} {/* Для отладки */}
              </>
            )}

            <button className="button" onClick={handleEditLanguage}>Сохранить изменения</button>
            <button className="button" onClick={closeEditLanguageModal}>Закрыть</button>
          </div>
        </div>
      )}

      {/* Upload Image Modal */}
      {isUploadImageModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Загрузить изображение</h2>
            <input type="file" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
            <button className="button" onClick={handleUploadImage}>Загрузить</button>
            <button className="button" onClick={closeUploadImageModal}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditLanguagesPage;
