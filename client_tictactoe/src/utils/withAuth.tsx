// "use client";
// import { redirect, useRouter } from "next/navigation"; // Use `next/router` for route changes
// import {AuthActionTypes, useAuth, useAuthDispatch} from "@/contexts/AuthContext";
// import { useEffect } from "react";
// import { fetchUserAPI } from "@/apiCalls/users";

// const withAuth =  <P extends {}>(WrappedComponent: React.ComponentType<P>) => {
//     const AuthComponent = (props: any) => {
//         const authDispatch = useAuthDispatch();
//         const router = useRouter();
//         const user = useAuth().user;
//       useEffect(() => {
//         const setUser = async () =>{
//             const res= await fetchUserAPI();
//             if (!!res.data.user) {
//                 authDispatch({
//                   type: AuthActionTypes.LOGIN,
//                   payload: { user: res.data.user }
//                 });
//               } else {
//                 authDispatch({
//                   type: AuthActionTypes.SET_ERROR,
//                   payload: { error: res.data }
//                 });
//               }
//         }
//         setUser();
//         if (!(!!user?.emailId || !!user?.userId)) {

//           router.replace("/login"); // Use `router.push` for route changes
//         }
  
//       }, []);

  
//     return user ? 
//       <WrappedComponent {...props} /> 
//       : redirect("/home")
//   };

//   return AuthComponent;
// };

// export default withAuth;
