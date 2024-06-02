import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Spinner } from "./tailwind-ex-elements";

export default function Articles() {
    const [publishedArticles, setPublishedArticles] = useState(null);
    const [unpublishedArticles, setUnpublishedArticles] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        const getArticles = async () => {
            const token = localStorage.getItem("Authorization");
            if (!token) {
                navigate("/sign-in");
            };
            try {
                const response = await fetch("/api/articles/writers_articles", { 
                    mode: "cors",
                    headers: { "Authorization": token}
                });
                if (!response.ok) {
                    throw new Error(response.status);
                }
                const actualData = await response.json();
                setPublishedArticles(actualData.filteredArticles.filter(item => item.published));
                setUnpublishedArticles(actualData.filteredArticles.filter(item => !item.published));
                setError(null);
            } catch (err) {
                setError(err.message);
                setPublishedArticles(null);
                setUnpublishedArticles(null);
            } finally {
                setLoading(false);
            }
        }
        getArticles();
    }, [])

    return (
    <>
        <div className="flex flex-col lg:grid lg:grid-cols-2">
            <div>
                <div className="flex flex-col p-2.5 sm:p-5 sm:max-w-5xl">
                    <div className="bg-blue-950 rounded-b-none rounded-lg">
                        <h5 className="p-3 text-2xl font-sedan font-bold tracking-tight text-gray-100 lg:text-4xl sm:font-black sm:p-5">Your Published Articles</h5>
                    </div>
                    <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none shadow p-3 sm:p-5 dark:bg-slate-700">
                        {loading && (
                            <div className="flex justify-center items-center">
                                <Spinner id="spinner"/>
                            </div>
                        )}
                        {publishedArticles && (
                            publishedArticles.length ? (
                                publishedArticles.map(item => (
                                    <ArticleCard data={item} />
                                ))
                            ) : (
                                <p className="font-bold italic dark:text-slate-100">No published articles.</p>
                            )
                        )}
                        {error && (
                            <div className="text-white">
                                <img src="" alt="" className="error"/>
                                <p>ERROR: {error}</p>
                                <p>Apologies - an error has occured trying to fetch data from the server. Please try again later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <div className="flex flex-col p-2.5 sm:p-5 sm:max-w-5xl">
                    <div className="bg-blue-950 rounded-b-none rounded-lg">
                        <h5 className="p-3 text-2xl font-sedan font-bold tracking-tight text-gray-100 lg:text-4xl sm:font-black sm:p-5">Your Unpublished Articles</h5>
                    </div>
                    <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none shadow p-3 sm:p-5 dark:bg-slate-700">
                        {loading && (
                            <div className="flex justify-center items-center">
                                <Spinner id="spinner"/>
                                <p className="my-10"></p>
                            </div>
                        )}
                        {unpublishedArticles && (
                            unpublishedArticles.length ? (
                                unpublishedArticles.map(item => (
                                    <ArticleCard data={item} />
                                ))
                            ) : (
                                <p className="font-bold italic dark:text-slate-100">No unpublished articles. Click on 'New Article' below to create one!</p>
                            )
                        )}
                        {error && (
                            <div className="text-white">
                                <img src="" alt="" className="error"/>
                                <p>ERROR: {error}</p>
                                <p>Apologies - an error has occured trying to fetch data from the server. Please try again later.</p>
                            </div>
                        )}
                        <Link to="/dashboard/new" className="flex justify-center items-center m-2.5 sm:mx-5">
                            <button className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 font-semibold leading-6 text-white shadow-sm sm:max-w-5xl hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">New Article</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

function ArticleCard({ data }) {
    return (
        <Link to={`/dashboard/${data._id}/update`} className="border-l-2 border-black my-1.5 sm:my-2.5 hover:opacity-80 dark:border-white">
            <div className="flex flex-col pl-1.5 sm:pl-2.5">
                <h5 className="font-bold tracking-tight text-gray-900 sm:text-lg sm:font-black dark:text-gray-100">{data.title}</h5>
                <p className="text-sm italic dark:text-slate-100">{data.synopsis}</p>
                <p className="self-end text-sm italic font-black dark:text-slate-100">Last Edited: {data.date_formatted}</p>
            </div>
        </Link>
    )
}