import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Spinner } from "./tailwind-ex-elements";

export default function SignIn() {
    // TODO: Need to return errors is email is not valid email
    // TODO: Need to ensure specific information comes through to user (i.e. password incorrect or user not found)
    // See the playlist on react-hook-form (https://www.youtube.com/playlist?list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s)
    const form = useForm();
    const { register, control, handleSubmit, formState } = form;
    const { errors } = formState;
    const navigate = useNavigate();
    const [isPending, setIsPending] = useState(false);
    const [loginError, setLoginError] = useState(null);

    const onSubmit = async (data) => {
        setIsPending(true)
        axios.post("/api/writers/sign-in", data)
            .then(response => {
                const token = response.data.token;
                if (!token) {
                    setIsPending(false);
                    setLoginError(response.data.error);
                    return;
                }
                localStorage.setItem("Authorization", token);
                window.location.assign("/dashboard/articles")
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {loginError && (
                    <p className="font-bold text-red-400">{loginError}</p>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm leading-6 text-gray-100">Email</label>
                    <input autoComplete="email" required id="email" {...register("email", {
                        required: "Email is required",
                        maxLength: {
                            value: 30,
                            message: "Email cannot be longer than twenty (30) characters long!"
                        },
                    })}
                        className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6" />
                </div>
                <span className="text-sm font-bold text-red-400">
                    <p>{errors.email?.message}</p>
                </span>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-100 sm:min-w-80">Password</label>
                    <input type="password" id="password" autoComplete="current-password" required 
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least eight (8) characters long"
                            },
                        })} 
                        className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"/>
                    <span className="text-sm font-bold text-red-400">
                        <p>{errors.password?.message}</p>
                    </span>
                </div>
                <div>
                    { isPending ? (
                            <div className="flex justify-center">
                                <Spinner id="spinner"/>
                            </div>
                        ) : (
                            <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">Sign In</button>
                    )}
                </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-100"> Not a member? <Link to="/users/sign-up" className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500">Sign Up</Link></p>
        </>
    )
}