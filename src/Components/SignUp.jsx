import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Spinner } from "./tailwind-ex-elements";

export default function SignUp() {
    // See the playlist on react-hook-form (https://www.youtube.com/playlist?list=PLC3y8-rFHvwjmgBr1327BA5bVXoQH-w5s)
    const form = useForm();
    const navigate = useNavigate();
    const { register, control, handleSubmit, formState, watch } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [signupError, setSignupError] = useState(null);

    const onSubmit = async (data) => {
        setIsPending(true);
        try {
            const response = await fetch("/api/writers/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                setSignupError(`Sorry, a HTTP error has occured. Please try again later. Status: ${response.status}`)
                return;
            };
            const responseData = await response.json();
            if (responseData.id) {
                console.log("Success!");
                navigate("/users/sign-in");
            } else {
                setSignupError(responseData.errors)
                console.log(signupError);
            }
        } catch (err) {
            console.log(err)
        } finally {
            setIsPending(false);
        }
    }
    
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {signupError && (
                    <p className="font-bold text-red-400">{signupError}</p>
                )}
                <div className="flex items-center justify-between gap-5">
                    <div>
                        <label htmlFor="username" className="block text-sm leading-6 text-gray-100">Username</label>
                        <input autoComplete="username" required id="username" {...register("username", {
                            required: "Username is required",
                            maxLength: {
                                value: 20,
                                message: "Username cannot be longer than twenty (20) characters long!"
                            },
                        })}
                            className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm leading-6 text-gray-100">Email</label>
                        <input autoComplete="email" required id="email" {...register("email", {
                            required: "Email is required",
                            maxLength: {
                                value: 50,
                                message: "Email cannot be longer than twenty (50) characters long!"
                            },
                        })}
                            className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <span className="block flex justify-between text-red-400 !mt-0">
                    <span className="text-sm font-bold">
                            <p>{errors.username?.message}</p>
                    </span>
                    <span className="text-sm font-bold">
                            <p>{errors.email?.message}</p>
                    </span>
                </span>
                <div>
                    <div className="flex items-center justify-between gap-5">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-100">Password</label>
                            <input type="password" id="password" autoComplete="current-password" required 
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least eight (8) characters long"
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: "Must contain: uppercase, lowercase, number, and special character"
                                },
                            })} 
                            className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"/>
                        </div>
                        <div>
                            <label htmlFor="confPassword" className="block text-sm font-medium leading-6 text-gray-100">Confirm Password</label>
                            <input type="password" id="confPassword" required {...register("confPassword", {
                                required: "Please confirm your password", 
                                validate: {
                                    passwordMatch: (fieldValue) => {
                                        return (
                                            fieldValue == watch("password") || "Passwords do not match"
                                        )
                                    }
                                }
                            })}
                                className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-red-400">
                        <p>{errors.password?.message}</p>
                        <p>{errors.confPassword?.message}</p>
                    </span>
                </div>
                <div>
                    <div>
                        <label htmlFor="passkey" className="block text-sm font-medium leading-6 text-gray-100">Writer Pass Key</label>
                        <input type="passkey" id="passkey" required 
                            {...register("passkey", { required: "Writer Pass Key is required" })} 
                            className="block w-full rounded-md border-0 py-1.5 px-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-yellow-500 sm:text-sm sm:leading-6"/>
                    </div>                        
                </div>
                <span className="text-sm font-bold text-red-400">
                    <p>{errors.passkey?.message}</p>
                </span>
                <div>
                    { isPending ? (
                        <div className="flex justify-center">
                            <Spinner id="spinner"/>
                        </div>
                    ) : (
                        <button type="submit" className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">Sign Up</button>
                    )}
                </div>
            </form>
            <p className="mt-10 text-center text-sm text-gray-100"> Already a member? <Link to="/users/sign-in" className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500">Login</Link></p>
        </>
    )
}