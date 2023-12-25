"use client";
import { FC, useEffect } from "react";
import { AuthState, useAuthContext } from "../contexts/StateContexts/AuthContext";
import {
  AuthActionTypes,
  useAuthDispatchContext,
} from "../contexts/DispatchContexts/AuthDispatchContext";
import { useRouter } from "next/navigation";
import { userAPICalls } from "@/apiCalls/users";

const useAuthHook = () => {
  const authState = useAuthContext();
  const authDispatch = useAuthDispatchContext();
  const router = useRouter();

  const logout = async() =>{
    await userAPICalls.logoutUserAPI().then((res) => {
      if (res.status < 300) {
        authDispatch({
          type: AuthActionTypes.LOGOUT,
          payload: undefined
        });
        // router.replace("/rooms")
      } else {
        authDispatch({
          type: AuthActionTypes.LOGOUT,
          payload: undefined,
        });
        authDispatch({
          type: AuthActionTypes.SET_ERROR,
          payload: {
            error: res.data,
          },
        });
        router.replace("/login");
      }
    });
  }

  const register = async(emailId:string, password:string, confirmPassword:string) =>{
    await userAPICalls.registerUserAPI(emailId,password,confirmPassword).then((res) => {
      if (res.status < 300) {
        router.replace("/login");

      } else {
  
        authDispatch({
          type: AuthActionTypes.SET_ERROR,
          payload: {
            error: res.data,
          },
        });
      }
    });
  }

  useEffect(() => {
    let subscribed = true;
    if(subscribed){
    console.log("AuthContext - use effect triggered ");
    const fetchUser = async () => {
      await userAPICalls.fetchUserAPI().then((res) => {
        if (res.status < 300) {
          authDispatch({
            type: AuthActionTypes.LOGIN,
            payload: {
              user: {
                emailId: res.data.user.emailId,
                userId: res.data.user.userId,
              },
            },
          });
          // router.replace("/rooms")
        } else {
          authDispatch({
            type: AuthActionTypes.LOGOUT,
            payload: undefined,
          });
          authDispatch({
            type: AuthActionTypes.SET_ERROR,
            payload: {
              error: res.data,
            },
          });
          router.replace("/login");
        }
      });
    };

    // if (!authState.user) {
      // Only fetch the user if it's not available in the state
      fetchUser();

    
    // }
  }
  return ()=>{
    console.log("Killing useAuthHookontext")
    authDispatch({
      type: AuthActionTypes.LOGOUT,
      payload: undefined,
    });
    subscribed = false;
  }    
  }, []);

  // ...

  return { authState, authDispatch, logout, register };
};

export default useAuthHook;
