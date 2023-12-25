"use client";
import { UserPublicInterface } from "@/types/UserPublic.Interface";
import { createContext, useContext } from "react";
import { AuthState } from "../StateContexts/AuthContext";

export enum AuthActionTypes  {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    SET_ERROR = 'SET_ERROR',
    CLEAR_ERROR = 'CLEAR_ERROR'

}

interface AuthActionPayloads {
    [AuthActionTypes.LOGIN]: { user: UserPublicInterface };
    [AuthActionTypes.LOGOUT]: undefined;
    [AuthActionTypes.SET_ERROR]: { error: string };
    [AuthActionTypes.CLEAR_ERROR]: undefined;
  }
  
export type AuthAction =  {
    type: AuthActionTypes,
    payload:AuthActionPayloads[AuthActionTypes]
}

export const AuthDispatchContext = createContext<((action: AuthAction) => void) | null>(null);


export const useAuthDispatchContext = () =>{
    const context = useContext(AuthDispatchContext);
    if(!context){
        throw Error("Auth Dispatch Context not defined")
    }
    return context;
}

