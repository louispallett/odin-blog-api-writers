import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Editor } from '@tinymce/tinymce-react';
import { useParams, useNavigate } from "react-router-dom"

import { Spinner } from "./tailwind-ex-elements";

export default function UpdateArticle() {
    const { id } = useParams();
    const form = useForm();
    const { register, control, handleSubmit, formState } = form;
    const { errors } = formState;
    const [pending, setPending] = useState(false);
    const [articleData, setArticleData] = useState(null);

    const [apiKey, setApiKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);

    const navigate = useNavigate();
    
    const onSubmit = async (data) => {
        setPending(true);
        const token = localStorage.getItem("Authorization");
        if (!token) {
            setPending(false);
            return;
        }
        
        if (!editorRef.current) {
            console.log("Error with Editor Ref");
            return;
        }

        const formData = new FormData();
        formData.append('content', editorRef.current.getContent());
        formData.append('banner', data.banner[0]);
        Object.keys(data).forEach(key => {
            if (key !== 'banner') {
                formData.append(key, data[key]);
            }
        });
        try {
            const response = await fetch(`/api/articles/${id}/update`, {
                method: "POST",
                headers: {
                    "Authorization": token
                },
                body: formData
            });
            if (!response.ok) {
                console.error("Error in response:", response.status, response.statusText);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setPending(false);
            navigate(`/dashboard/${id}/update`)
        }
    }

    const confirmPublish = () => {
        const element = document.getElementById("publishConfirm");
        element.style.display = "block";
    }
    
    const cancelPublish = () => {
        const element = document.getElementById("publishConfirm");
        element.style.display = "none";
    }
    
    const publishArticle = async () => {
        cancelPublish();
        setPending(true);
        try {
            const response = await fetch(`/api/articles/${id}/publish`, {
                method: "POST"
            });
            if (!response.ok) {
                console.error("Error in response:", response.status, response.statusText);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setPending(false);
        }
    }

    const confirmDelete = () => {
        const element = document.getElementById("deleteConfirm");
        element.style.display = "block";
    }

    const cancelDelete = () => {
        const element = document.getElementById("deleteConfirm");
        element.style.display = "none";
    }

    const deleteArticle = async () => {
        cancelDelete();
        setPending(true);
        const token = localStorage.getItem("Authorization");
        if (!token) {
            setPending(false);
            return;
        }
        try {
            const response = await fetch(`/api/articles/${id}/delete`, {
                method: "POST",
                headers: {
                    "Authorization": token
                },                
            });
            if (!response.ok) {
                console.error("Error in response:", response.status, response.statusText);
            } else {
                navigate("/dashboard/articles");
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const getApi = async () => {
            try {
                const response = await fetch("/api/writers/new", { mode: "cors" });
                if (!response.ok) {
                    throw new Error(response.status);
                }
                const actualData = await response.json();
                setApiKey(actualData.key);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getApi();

        const getArticleData = async () => {
            try {
                const response = await fetch(`/api/articles/${id}`, { mode: "cors" });
                if (!response.ok) {
                    throw new Error(response.status);
                }
                const actualData = await response.json();
                setArticleData(actualData.article);
                setError(null);
            } catch (err) {
                setError(err.message);
                setArticleData(null);
            } finally {
                setLoading(false);
            }
        }
        getArticleData();
    }, [pending])


    return (
        <div className="grid justify-center max-w-full">
        <div className="grid p-2.5 sm:p-5 sm:max-w-5xl">
            <div className="bg-blue-950 rounded-b-none rounded-lg">
                <h5 className="p-3 text-2xl font-sedan font-bold tracking-tight text-gray-100 sm:text-4xl sm:font-black sm:p-5">Update Article</h5>
            </div>
            <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none shadow p-3 sm:p-5 dark:bg-slate-700">
                { articleData ? (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2.5 sm:gap-3.5" noValidate >
                            <div className="dark:text-slate-100">
                                <p className="font-bold text-lg ">Updating an article</p>
                                {/* TODO: change the link here to our actual main site */}
                                <p>You can now carry on with your article. You can check out what articles look like once published on our
                                    <a href="http://localhost:3000/dashboard/articles/" className="font-bold text-blue-950 dark:text-yellow-400 hover:text-blue-800 dark:hover:text-yellow-500"> main site</a>.
                                    Once you've finished, save your article and then click Publish to put it to the main page!
                                </p>
                            </div>
                            <div>
                                <label htmlFor="title" className="font-bold dark:text-slate-100">Title</label>
                                <input type="text" id="title" maxLength={40} minLength={2} required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-950 dark:focus:ring-yellow-400 sm:text-sm sm:leading-6 dark:bg-transparent dark:text-slate-100"
                                {...register("title", {
                                    required: "Title is required",
                                    maxLength: {
                                        value: 40,
                                        message: "Max length is 40 characters",
                                    },
                                })}
                                defaultValue={articleData.title}
                                />
                            </div>
                            <div>
                                <label htmlFor="synopsis" className="font-bold dark:text-slate-100">Synopsis</label>
                                <textarea type="text" id="synopsis" maxLength={300} minLength={2} required
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset outline-none focus:ring-blue-950 dark:focus:ring-yellow-400 sm:text-sm sm:leading-6 dark:bg-transparent dark:text-slate-100"
                                {...register("synopsis", {
                                    required: "Synopsis is required",
                                    maxLength: {
                                        value: 200,
                                        message: "Max length is 200 characters",
                                    },
                                })}
                                defaultValue={articleData.synopsis}
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="banner" className="font-bold dark:text-slate-100">Banner Image</label>
                                <div className="flex flex-col">
                                    <input type="file" id="banner" accept="image/*"
                                        className="font-bold dark:text-slate-100 hover:cursor-pointer my-1.5 sm:my-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                                        {...register("banner", {})}
                                    />
                                    {articleData.image_url && (
                                        <p className="text-sm dark:text-slate-100">Current image 
                                        <a className="font-bold text-yellow-400" href={articleData.image_url} target="_blank" rel="noopener noreferrer"> here
                                            </a>. If you upload a new image and save it will replace this one.</p>
                                    )}
                                </div>
                            </div>   
                            <div className="flex justify-center items-center font-bold text-sm text-slate-100">
                                <p className="bg-blue-700 py-1.5 px-2.5 sm:px-3.5 rounded-s-md">Publication status: </p>
                                { articleData.published ? (
                                    <p className="bg-green-700 py-1.5 px-2.5 sm:px-3.5 rounded-e-md">Published</p>
                                ) : (
                                    <p className="bg-red-700 py-1.5 px-2.5 sm:px-3.5 rounded-e-md">Not Published</p>
                                )}
                            </div>
                            { loading && (
                                <div className="flex justify-center items-center my-20">
                                    <Spinner id="spinner"/>
                                </div>
                            )}
                            { apiKey && (
                                <>
                                    <div className="dark:text-slate-100">
                                        <p><b>Content</b></p>
                                    </div>
                                    <Editor
                                        apiKey={apiKey}
                                        onInit={(_evt, editor) => editorRef.current = editor}
                                        initialValue={articleData.content}
                                        init={{
                                        skin: (window.matchMedia("(prefers-color-scheme: dark)").matches ? "oxide-dark" : "oxide"),
                                        content_css: (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : ""),
                                        height: 500,
                                        menubar: false,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                    />
                                    <button type="submit"
                                        className="flex w-full justify-center rounded-md bg-green-600 px-3 mt-2.5 py-1.5 font-semibold leading-6 text-white shadow-sm sm:max-w-5xl hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                    >
                                        { pending ? ( <Spinner id="spinner" /> ) : ( <span>Save</span> )}
                                    </button>
                                </>
                            )}
                        </form>
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
                            <button onClick={confirmPublish}
                                className="flex w-full justify-center rounded-md bg-yellow-600 px-3 mt-2.5 py-1.5 font-semibold leading-6 text-white shadow-sm sm:max-w-5xl hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                            >
                                { pending ? ( <Spinner id="spinner" /> ) : (articleData.published ? ( <span>Unpublish</span> ) : ( <span>Publish</span> ))}
                            </button>
                            <button onClick={confirmDelete}
                                className="flex w-full justify-center rounded-md bg-red-600 px-3 mt-2.5 py-1.5 font-semibold leading-6 text-white shadow-sm sm:max-w-5xl hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            >
                                { pending ? ( <Spinner id="spinner" /> ) : ( <span>Delete</span> )}
                            </button>
                        </div>
                    </>
                    ) : (
                        <div className="flex justify-center items-center my-10">
                            <Spinner id="spinner" />
                        </div>
                    )}
                    { articleData && (
                        <>
                            <div className="hidden dark:text-slate-100 p-3.5 sm:p-5" id="publishConfirm">
                                <h1 className="text-xl font-bold tracking-tight text-nowrap py-2.5 max-sm:text-wrap">Publish this article?</h1>
                                <p className="my-2.5 mb-5">Publishing this article will make it visible to the public</p>
                                <div className="flex justify-center gap-2.5 sm:gap-3.5">
                                    <button onClick={publishArticle}
                                        className="flex justify-center w-full rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">
                                        { articleData.published ? ( <span>Unpublish</span> ) : ( <span>Publish</span> ) }</button>
                                    <button onClick={cancelPublish}
                                        className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                        Cancel</button>
                                </div>
                            </div>
                            <div className="hidden dark:text-slate-100 p-3.5 sm:p-5" id="deleteConfirm">
                                <h1 className="text-xl font-bold tracking-tight text-nowrap py-2.5 max-sm:text-wrap">Delete this article?</h1>
                                <p className="my-2.5 mb-5">Are you sure you want to delete this article? This is irreversable!</p>
                                <div className="flex justify-center gap-2.5 sm:gap-3.5">
                                    <button onClick={deleteArticle}
                                        className="flex justify-center w-full rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                        Delete</button>
                                    <button onClick={cancelDelete}
                                        className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">
                                        Cancel</button>
                                </div>
                            </div>
                        </>
                    )}

            </div>
        </div>
    </div>
    )
}