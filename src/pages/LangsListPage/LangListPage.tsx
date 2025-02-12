import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { setSearchQuery } from "../../store/slices/filterSlice";
import { Lang } from "../../modules/types.ts";
import { Langs_Mock } from "../../modules/mock.ts";
import "./LangListPage.css";
import "../../components/global.css";
import LanguageItem from "../../components/LanguageItem/LanguageItem.tsx";
import Header from "../../components/Header/Header.tsx";
import { ROUTE_LABELS, ROUTES } from "../../Routes.tsx";
import { Link } from 'react-router-dom';

const LangListPage = () => {
    const [languages, setLanguages] = useState<Lang[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [draftID, setDraftID] = useState(0);
    const token = useSelector((state: RootState) => state.user.token);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    // @ts-ignore
    const [isMock, setIsMock] = useState(false);
    // @ts-ignore
    const [imageLoadingStatus, setImageLoadingStatus] = useState<boolean[]>([]);

    const searchQuery = useSelector((state: RootState) => state.filter.searchQuery);
    const dispatch = useDispatch();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const headers: HeadersInit = {};
            if (token) {
                headers['Authorization'] = `${token}`;
            }

            const response = await fetch(`/api/info?langname=${searchQuery.toLowerCase()}`, {
                method: 'GET',
                headers,
                signal: AbortSignal.timeout(5000),
            });
            if (!response.ok) throw new Error("Ошибка сети");
            const result = await response.json();

            setLanguages(
                result.langs.map((lang: any) => ({
                    id: lang.ID,
                    name: lang.Name,
                    shortDescription: lang.ShortDescription,
                    description: lang.Description,
                    imgLink: lang.ImgLink,
                    author: lang.Author,
                    year: lang.Year,
                    version: lang.Version,
                    list: lang.List,
                    status: lang.Status,
                }))
            );
            setCartCount(result.count || 0);
            setDraftID(result.draftID);
            setIsMock(false);
        } catch (err) {
            console.error("Fetch error:", err);
            loadMockData();
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    const loadMockData = useCallback(() => {
        setIsMock(true);
        setLanguages(Langs_Mock.filter(lang => lang.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }, [searchQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleAddToCart = () => {
        setCartCount(prevCount => prevCount + 1);
    };    

    const handleImageLoad = (index: number) => {
        setImageLoadingStatus(prevStatus => {
            const updatedStatus = [...prevStatus];
            updatedStatus[index] = true;
            if (updatedStatus.every(status => status)) {
                setLoading(false);
            }
            return updatedStatus;
        });
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="body">
            <div className="services-container">
                <Header
                        showBreadCrumbs={true}
                        showBurgerMenu={true}
                        crumbs={[{ label: ROUTE_LABELS.LIST, path: ROUTES.LIST }]}
                        showProfileMenu={true}
                        showHistory={true}
                />
                <SearchField name={searchQuery} onNameChange={handleInputChange} />
                <CartState cartCount={cartCount} draftID={draftID} />
                <img className="separator-line" src="img/line.png" alt="separator" />
                <ul className="service-list">
                    {loading ? (
                        <div className="loading">Загрузка</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : languages.length > 0 ? (
                        languages.map((lang, index) => (
                            <LanguageItem
                                key={lang.id}
                                lang={lang}
                                onImageLoad={() => handleImageLoad(index)}
                                onAddToCart={handleAddToCart}
                            />
                        ))
                    ) : (
                        <div className="error">
                            <h1>Язык не найден</h1>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

const SearchField: React.FC<{ name: string; onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({
    name,
    onNameChange,
}) => (
    <div className="search-section">
        <input
            type="text"
            className="field-search-text"
            maxLength={100}
            placeholder="Поиск..."
            value={name}
            onChange={onNameChange}
        />
        <img className="search-icon" src="img/icon-find.png" alt="Поиск" />
    </div>
);

const CartState: React.FC<{ cartCount: number; draftID: number }> = ({ cartCount, draftID }) => (
    <div className="file-count-section">
        {cartCount !== 0 ? (
            <Link to={`${ROUTES.PROJECT}${draftID}`} className="file-count">
                <img className="file-count-icon" src="img/icon-count-files.png" alt="files" />
                <div className="file-count-text">{cartCount}</div>
            </Link>
        ) : (
            <div className="file-count">
                <img className="file-count-icon" src="img/icon-count-files.png" alt="files" />
                <div className="file-count-text">{cartCount}</div>
            </div>
        )}
    </div>
);

export default LangListPage;
