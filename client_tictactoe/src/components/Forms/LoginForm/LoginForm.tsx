"use client";
import { userAPICalls } from "@/apiCalls/users";
import { AuthActionTypes } from "@/contextAPI/contexts/DispatchContexts/AuthDispatchContext";
import useAuthHook from "@/contextAPI/hooks/useAuthHook";
import {  useRouter } from "next/navigation";
import { FC, Fragment, useRef, useState } from "react";
import styles from "./LoginForm.module.css";


interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = ({}) => {
  const router = useRouter();

  const emailIdInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);


  const { authState, authDispatch } = useAuthHook();

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (emailIdInputRef.current?.value && passwordInputRef.current?.value) {
      setError(null);
      const res = await userAPICalls.loginUserAPI(
        emailIdInputRef.current?.value,
        passwordInputRef.current?.value
      );
      if (res.status >= 300) {
        console.log("While loggin setting error ", res);
        setError(res.data);
        authDispatch({
          type: AuthActionTypes.LOGOUT,
          payload: undefined,
        });
        authDispatch({
          type: AuthActionTypes.SET_ERROR,
          payload: { error: res.data },
        });
      } else {
        setError(null);

        authDispatch({
          type: AuthActionTypes.LOGIN,
          payload: { user: res.data.user },
        });

        router.replace("/rooms");
      }
    } else {
      if (!!!emailIdInputRef.current?.value) {
        setError("EmailId  cannot be empty !");
      } else if (!!!passwordInputRef.current?.value) {
        setError("Password  cannot be empty !");
      } else {
        setError("EmailId or Password cannot be empty !");
      }
    }
  };

  return (
    <Fragment>
      <div className={styles.container}>

      <form className={styles.formContainer}>
        <input type="text" placeholder="EmailId" ref={emailIdInputRef} className={styles.inputField}/>
        <input type="password" placeholder="Password" ref={passwordInputRef} className={styles.inputField}/>
        <button onClick={handleLogin} className={styles.btn}>
          Login
        </button>
      </form>
      <p className={styles.message}>{error && error}</p>
      </div>
    </Fragment>
  );
};

export default LoginForm;
