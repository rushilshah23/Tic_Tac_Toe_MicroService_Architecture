"use client";
import { userAPICalls } from "@/apiCalls/users";
import { AuthActionTypes } from "@/contextAPI/contexts/DispatchContexts/AuthDispatchContext";
import useAuthHook from "@/contextAPI/hooks/useAuthHook";
import {  useRouter } from "next/navigation";
import { FC, Fragment, useRef, useState } from "react";
import styles from "./RegisterForm.module.css";


interface RegisterFormProps {}

const RegisterForm: FC<RegisterFormProps> = ({}) => {
  const router = useRouter();

  const emailIdInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | null>(null);


  const { authState, authDispatch, register } = useAuthHook();

  const handleRegister= async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (emailIdInputRef.current?.value && passwordInputRef.current?.value && confirmPasswordInputRef.current?.value) {
      setError(null);
      const res = await userAPICalls.registerUserAPI(
        emailIdInputRef.current?.value,
        passwordInputRef.current?.value,
        confirmPasswordInputRef.current.value
      );
      if (res.status >= 300) {
        console.log("While registering setting error ", res);
        setError(res.data);
     
   
      } else {
        setError(null);

   

        // router.replace("/rooms");
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
        <input type="password" placeholder="Confirm Password" ref={confirmPasswordInputRef} className={styles.inputField}/>

        <button onClick={handleRegister} className={styles.btn}>
          Login
        </button>
      </form>
      <p className={styles.message}>{error && error}</p>
      </div>
    </Fragment>
  );
};

export default RegisterForm;
