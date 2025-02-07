import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Langs_Mock } from '../../modules/mock';
import { Lang } from '../../modules/types';
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs.tsx";
import { ROUTE_LABELS, ROUTES } from "../../Routes.tsx";
import "./LangPage.css";
import "../../components/global.css";

const LangPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [langData, setLangData] = useState<Lang | null>(null);
    const [isMock, setIsMock] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchLangData = async () => {
        try {
            const response = await fetch(`/api/info/${id}`, { signal: AbortSignal.timeout(5000) });
            if (!response.ok) throw new Error('Network response failed');

            const result = await response.json();
            const lang = {
                id: result.info.ID,
                name: result.info.Name,
                shortDescription: result.info.ShortDescription,
                description: result.info.Description,
                imgLink: result.info.ImgLink,
                author: result.info.Author,
                year: result.info.Year,
                version: result.info.Version,
                list: result.info.List,
                status: result.info.Status,
            };

            setLangData(lang);
            setError(null);
        } catch (error) {
            console.error('Fetch error or invalid data:', error);
            setIsMock(true);
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbsData = [
        { label: ROUTE_LABELS.LIST, path: ROUTES.LIST },
        { label: langData ? langData.name : "Язык", path: ROUTES.LANG + id }
    ];

    useEffect(() => {
        const loadLangData = () => {
            const idNum = parseInt(id as string, 10);
            const mockLang = Langs_Mock.find(lang => lang?.id === idNum) as Lang;
            if (mockLang) {
                setLangData(mockLang);
                setError(null);
            } else {
                setError('Язык не найден');
            }
        };

        if (isMock) {
            loadLangData();
        } else {
            fetchLangData();
        }

        return () => {
            setLangData(null);
        };
    }, [id, isMock]);

    return (
        <div className="body">
            <div className="information-about">
                <BreadCrumbs crumbs={breadcrumbsData} />

                {loading ? (
                    <div className="loading">Загрузка</div>
                ) : error ? (
                    <div className="error-container">
                        <div className="error">
                            <p>{error}</p>
                        </div>
                    </div>
                ) : langData ? (
                    <LangDetails lang={langData} />
                ) : (
                    <div className="not-found">Язык не найден</div>
                )}
            </div>
        </div>
    );
};

const LangDetails: React.FC<{ lang: Lang }> = ({ lang }) => (
    <div className="info">
        <div className="title">
            <div className="text-name-lang">{lang.name}</div>
            <div className="text-description-lang">"{lang.shortDescription}"</div>
            { lang.imgLink ? (
                <img className="img-lang" src={lang.imgLink} alt={lang.name} />
            ) : null}
        </div>

        <div className="background-basic-info">
            <LangBasicInfo label="Автор" value={lang.author || "N/A"} number={1} />
            <LangBasicInfo label="Год выпуска" value={lang.year || "N/A"} number={2} />
            <LangBasicInfo label="Последняя версия" value={lang.version || "N/A"} number={3} />
        </div>

        <div className="background-additional-info">
            <div className="text-additional-info">
                <span className="bold-subtext">{lang.name}</span>
                <span className="subtext"> — {lang.description}:</span>
            </div>

            <FeatureList features={lang.list} />
        </div>
    </div>
);

const LangBasicInfo: React.FC<{ 
    label: string; 
    value: string | number; 
    number: number; 
}> = ({ label, value, number }) => (
    <div>
        <div className={`tag-basic-info tag-basic-info-${number}`}>{label}:</div>
        <div className={`subtext-basic-info subtext-basic-info-${number}`}>{value}</div>
    </div>
);


const FeatureList: React.FC<{ features: Record<string, string> }> = ({ features }) => (
    <ul className="features-list">
        {Object.entries(features).map(([key, value]) => (
            <li key={key}>
                <span className="bold-subtext">{key}: </span>
                <span className="subtext">{value}</span>
            </li>
        ))}
    </ul>
);

export default LangPage;
