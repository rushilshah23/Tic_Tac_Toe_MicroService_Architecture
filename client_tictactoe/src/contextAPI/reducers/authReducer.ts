"use client";
import { CONSTANTS } from "@/configs/constants.config";
import { AuthState } from "../contexts/StateContexts/AuthContext";
import { AuthAction, AuthActionTypes } from "../contexts/DispatchContexts/AuthDispatchContext";

export function authReducer(authState:AuthState,action:AuthAction):AuthState{
    switch (action.type) {
        case AuthActionTypes.LOGIN:
            if (action.payload instanceof Object && 'user' in action.payload) {
                localStorage.setItem(CONSTANTS.AUTH,JSON.stringify({
                  ...authState,
                  user: action.payload.user,
                  isLoggedIn: true,
                  error: null,
                }))
                return {
                  ...authState,
                  user: action.payload.user,
                  isLoggedIn: true,
                  error: null,
                };
              } else {
                console.log("Faild to extract login user details")
                // Handle the case where the payload doesn't have the expected structure.
                return authState;
              }
        case AuthActionTypes.LOGOUT:
          localStorage.setItem(CONSTANTS.AUTH,JSON.stringify({
            ...authState,
            user: null,
            isLoggedIn: false,
            error: null,
          }))
          return {
            ...authState,
            user: null,
            isLoggedIn: false,
            error: null,
          };
        case AuthActionTypes.SET_ERROR:
            if (action.payload instanceof Object && 'error' in action.payload) {
              localStorage.setItem(CONSTANTS.AUTH,JSON.stringify({
                ...authState,
                error: action.payload.error,
              }))
                return {
                  ...authState,
                  error: action.payload.error,
                };
              } else {
                // Handle the case where the payload doesn't have the expected structure.
                return authState;
              }
        case AuthActionTypes.CLEAR_ERROR:
          localStorage.setItem(CONSTANTS.AUTH,JSON.stringify({
            ...authState,
            error: null,
          }))
          return {
            ...authState,
            error: null,
          };
        default:
          return authState;
      }
}