import { useState, useEffect } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Users from "./Users";
import WriterDashboard from "./WritersDashboard";
import UpdateArticle from "./UpdateArticle";
import NewArticle from "./NewArticle";
import Articles from "./Articles";

export default function Router() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("Authorization");
            if (!token) {
                setIsAuth(false);
                return;
            };
            try {
                const response = await fetch("/api/writers/verify", { 
                    mode: "cors", 
                    headers: { "Authorization": `${token}`} 
                })
                if (response.status < 400) {
                    setIsAuth(true);
                } else {
                    setIsAuth(false);
                }
            } catch (err) {
                console.log(err)
            }
        }
        checkUser();
    }, []);
    
    const router = createBrowserRouter([
        {
            path: "/",
            element: !isAuth && <Navigate to="/users/sign-in" replace />,
            children: [
                {
                    path: "/dashboard",
                    element: <WriterDashboard />,
                    children: [
                        {
                            path: "articles",
                            element: <Articles />
                        },
                        {
                            path: "new",
                            element: <NewArticle />,
                        },
                        {
                            path: ":id/update",
                            element: <UpdateArticle />
                        }
                    ]
                }
            ]
        },
        {
            path: "/users",
            element: <Users />,
            children: [
                {
                    path: "sign-up",
                    element: isAuth ? <Navigate to="/dashboard/articles/" replace /> : <SignUp />
                },
                {
                    path: "sign-in",
                    element: isAuth ? <Navigate to="/dashboard/articles/" replace /> : <SignIn />
                }
            ]
        },
    ]);

    return <RouterProvider router={router} />;
}