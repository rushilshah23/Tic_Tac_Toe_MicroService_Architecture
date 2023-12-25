"use client"
import { useEffect, useReducer } from "react";
import { AuthContext, AuthState } from "../contexts/StateContexts/AuthContext";
import { AuthActionTypes, AuthDispatchContext } from "../contexts/DispatchContexts/AuthDispatchContext";
import { authReducer } from "../reducers/authReducer";
import { userAPICalls } from "@/apiCalls/users";
import { CONSTANTS } from "@/configs/constants.config";
import { useRouter } from "next/navigation";

type AuthProviderProps = {
    children: React.ReactNode
}

  export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const nullUser: AuthState = {
        user: null,
        error: "Some error while initializing",
        isLoggedIn: false,
      };
    // const [authState, authDispatch] = useReducer(authReducer, getAuthFromLocalStorage());
    const [authState, authDispatch] = useReducer(authReducer, nullUser);
    
    // const router = useRouter();
  
    // useEffect(() => {
    //   console.log("AuthContext - use effect triggered ")
    //   const fetchUser = async () => {
    //     await userAPICalls.fetchUserAPI().then((res)=>{
    //       if (res.status < 300) {
    //         authDispatch({  
    //           type: AuthActionTypes.LOGIN,
    //           payload: {
    //             user: {
    //               emailId: res.data.user.emailId,
    //               userId: res.data.user.userId,
    //             },
    //           },
    //         });
    //         router.replace("/rooms")
    //       } else {
    //         authDispatch({
    //           type: AuthActionTypes.LOGOUT,
    //           payload: undefined,
    //         });
    //         authDispatch({
    //           type: AuthActionTypes.SET_ERROR,
    //           payload: {
    //             error: res.data,
    //           },
    //         });
    //         router.replace("/login")
    //       }         
    //     });

    //   };
  
    // //   if (!authState.user) {
    //     // Only fetch the user if it's not available in the state
    //     fetchUser();
    // //   }
    // },[router]);
  
    // // ...
    // function getAuthFromLocalStorage(): AuthState {
    //     // Try to get user data from localStorage
    
    //     // try {
    //     //   const localStorageAuth = localStorage.getItem(CONSTANTS.AUTH);
    //     //   if (localStorageAuth) {
    //     //     try {
    //     //       return JSON.parse(localStorageAuth);
    //     //     } catch (error) {
    //     //       console.error("Error parsing localStorage auth data:", error);
    //     //       return nullUser;
    //     //     }
    //     //   }else{
    //     //     return nullUser;
    //     //   }
    //     // } catch (error) {
    //     //   return nullUser;
    //     // }




    //     return nullUser;
        
    //   }

  
    return (
      <AuthContext.Provider value={authState}>
        <AuthDispatchContext.Provider value={authDispatch}>
          {children}
        </AuthDispatchContext.Provider>
      </AuthContext.Provider>
    );
  }