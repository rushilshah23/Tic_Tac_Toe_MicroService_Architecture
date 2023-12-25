"use client";
import { UserPublicInterface } from "@/types/UserPublic.Interface"
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react"

export type AuthState = {
    user:UserPublicInterface | null,
    error: string | null,
    isLoggedIn: boolean
}


export const AuthContext = createContext<AuthState|null>(null);

export const useAuthContext=()=>{
    const context = useContext(AuthContext);
    if(!context){
        throw Error("Use Auth Context not defined")
    }

    // if(!context.user){
    //     router.replace("/home")
    // }
    return context;
}

