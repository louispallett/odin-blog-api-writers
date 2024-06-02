import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Editor } from '@tinymce/tinymce-react';
import { useNavigate } from "react-router-dom";

import { Spinner } from "./tailwind-ex-elements";

export default function NewArticle() {

    return (
        <div className="grid justify-center max-w-full">
            <div className="grid p-2.5 sm:p-5 sm:max-w-5xl">
                <div className="bg-blue-950 rounded-b-none rounded-lg">
                    <h5 className="p-3 text-2xl font-sedan font-bold tracking-tight text-gray-100 sm:text-4xl sm:font-black sm:p-5">New Article</h5>
                </div>
                <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none shadow p-3 sm:p-5 dark:bg-slate-700">
                    <ArticleForm />
                </div>
            </div>
        </div>
    )
}

function ArticleForm() {

    const form = useForm();
    const { register, control, handleSubmit, formState } = form;
    const { errors } = formState;
    const [pending, setIsPending] = useState(false);

    const [apiKey, setApiKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setIsPending(true);
        const token = localStorage.getItem("Authorization");
        if (!token) {
            setLoading(false);
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
            const response = await fetch("/api/articles/create_article", {
                method: "POST",
                headers: {
                    "Authorization": token
                },
                body: formData
            });
    
            if (!response.ok) {
                console.error("Error in response:", response.status, response.statusText);
            }
    
            const responseData = await response.json();
            navigate(`/dashboard/${responseData.new_article._id}/update`);
        } catch (err) {
            console.log(err);
        } finally {
            setIsPending(false);
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
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2.5 sm:gap-3.5" encType='multipart/form-data' noValidate >
            <div className="dark:text-slate-100">
                <p className="font-bold text-lg ">Submitting a new article</p>
                {/* TODO: change the link here to our actual main site */}
                <p>Submitting a new article is a simple process! You can check out what articles look like once published on our
                    <a href="http://localhost:3000/dashboard/articles/" className="font-bold text-blue-950 dark:text-yellow-400 hover:text-blue-800 dark:hover:text-yellow-500"> main site</a>.
                    You'll need to add a main title (make sure it's catchy and conveys clearly what the article is about!) and a synopsis which gives a little more detail. The title and synopsis inputs
                    are simple inputs (and will be styled automatically). The <b>content</b> section is a little more complex though, and you'll find instructions about it below.
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
                ></textarea>
            </div>
            <div>
                <label htmlFor="banner" className="font-bold dark:text-slate-100">Banner Image</label>
                <div className="flex items-center gap-5">
                    <div>
                        <input type="file" id="banner" accept="image/*"
                            className="font-bold dark:text-slate-100 hover:cursor-pointer my-1.5 sm:my-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                            {...register("banner", {})}
                        />
                    </div>
                </div>
            </div>
            { loading && (
                <div className="flex justify-center items-center my-20">
                    <Spinner id="spinner"/>
                </div>
            )}
            { apiKey && (
                <>
                    <TinyEditor editorRef={editorRef} apiKey={apiKey} />
                    { pending ? (
                        <div className="flex justify-center items-center my-5 gap-5">
                            <Spinner id="spinner" />
                            <p className="text-sm dark:text-slate-100">Please wait, this can take a minute or so...</p>
                        </div>
                    ) : (
                        <button type="submit"
                            className="flex w-full justify-center rounded-md bg-green-600 px-3 mt-2.5 py-1.5 font-semibold leading-6 text-white shadow-sm sm:max-w-5xl hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                        >Create</button>                                    
                    )}
                </>
            )}
        </form>
    )
}

function TinyEditor({ editorRef, apiKey }) {
    return (
        <>
            <div className="dark:text-slate-100">
                <p><b>Content</b>: Below you'll find the rich text editor where you can write the content of your article. You can select from various headings and subheadings along with different types of lists (unordered bullet points or ordered numbers).
                    Press Alt+0 (zero) for the help box (which contains keyboard shortcuts, etc.).</p>
                <p className="my-2.5 sm:my-3.5">Once finished, click save and it will send the article to the server and redirect you to the 'update' page for the article. You'll then be able to continue to edit the article and, when ready, mark it as 'published' where it will display on the main site.</p>
                <p>Note that some characters:, such as '&lt;', '&gt;', and '£' are unsafe characters and will get 'converted' when sent to the database.</p>
            </div>
            <Editor
                apiKey={apiKey}
                onInit={(_evt, editor) => editorRef.current = editor}
                initialValue="<h1>Heading 1</h1><h2>Heading 2</h2><h3>Subheading 1</h3><h4>Subheading 2</h4><p>Standard paragraph...</p><p>List of things:</p><ul><li>Thing 1</li><li>Thing 2</li>"
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
        </>
    )
}