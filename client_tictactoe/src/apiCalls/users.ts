import { UserPublicInterface } from "@/types/UserPublic.Interface";
import { ENV_VAR } from "@/configs/env.config"
import axios from "axios";
import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";
import { APIResponse, defaultAPIResponseObject } from "@/types/APIResponse.Interface";


 class UserAPICalls {
  private responseObject: APIResponse;

  constructor() {
    this.responseObject = defaultAPIResponseObject;
  }

  public validateRefreshToken = async (): Promise<APIResponse> => {
    this.responseObject = defaultAPIResponseObject;
    const possibleStatusCodes:HTTP_STATUS_CODES[] = [

    ];
    try {
      const res = await axios.post(`${ENV_VAR.PROXY_GATEWAY_URL}${ENV_VAR.AUTH_EXT}/local-verify-refrehtoken`, {},
        {
          withCredentials: true,
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
        })
      // const data = await res.data;
      // console.log("Verify Refresh Token response ", data);
      this.responseObject = {
        data: await res.data,
        message: "Refresh Token Authentication successfull",
        result: "SUCCESS",
        status: res.status
      }

    } catch (error: any) {
      console.log(error);
      const errorResponse = error.response;
      this.responseObject = {
        data: await errorResponse.data,
        message: "Refresh Token validation failure ",
        result: "FAIL",
        status: errorResponse.status
      }

    }
    console.log(this.responseObject)
    return this.responseObject;
  }



  public validateAccessToken = async (): Promise<APIResponse> => {
    this.responseObject = defaultAPIResponseObject;

    try {
      const res = await axios.post(`${ENV_VAR.PROXY_GATEWAY_URL}${ENV_VAR.AUTH_EXT}/local-authenticate`, {},
        {
          withCredentials: true,
          method: "POST",

          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },

        }

      );

      this.responseObject = {
        data: await res.data,
        message: "Access Token Authentication successfull",
        result: "SUCCESS",
        status: res.status
      }
      // return newUser;
    } catch (error: any) {
      console.log(error);
      const errorResponse = error.response;
      this.responseObject = {
        data: await errorResponse.data,
        message: "Access token validation failure ",
        result: "FAIL",
        status: errorResponse.status
      }

    }
    console.log(this.responseObject)
    return this.responseObject;

  };

  public fetchUserAPI = async (): Promise<APIResponse> => {
    this.responseObject = defaultAPIResponseObject;

    const accessTokenValidationResponse = await this.validateAccessToken();
    if (accessTokenValidationResponse.status > 300) {
      const refreshTokenValidationResponse = await this.validateRefreshToken();
      if (refreshTokenValidationResponse.status < 300) {
        return await this.validateAccessToken();

      } else {

        return {
          data: null,
          message: "Failed to verify access Token even after successfull refresh token verification",
          result: "FAIL",
          status: HTTP_STATUS_CODES.HTTP_409_CONFLICT,
        }
      }
    } else {
      return accessTokenValidationResponse
    }
  }

  public loginUserAPI = async (emailId: string, password: string): Promise<APIResponse> => {
    this.responseObject = defaultAPIResponseObject;


    try {
      const res = await axios.post(`${ENV_VAR.PROXY_GATEWAY_URL}${ENV_VAR.AUTH_EXT}/local-signin`,
        JSON.stringify({
          localLoginForm: {
            emailId: emailId,
            password: password,
          },
        }), {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      });
      // if (res.status < 300) {
        const data = await res.data;

        return await this.fetchUserAPI()

      // }
    } catch (error: any) {
      console.log(error);
      const errorResponse = error.response;
      this.responseObject = {
        data: await errorResponse.data,
        message: "User login failure ",
        result: "FAIL",
        status: errorResponse.status
      }

    }
    console.log(this.responseObject)
    return this.responseObject;
  }
  public registerUserAPI = async (emailId: string, password: string, confirmPassword:string): Promise<APIResponse> => {
    this.responseObject = defaultAPIResponseObject;


    try {
      const res = await axios.post(`${ENV_VAR.PROXY_GATEWAY_URL}${ENV_VAR.AUTH_EXT}/local-register`,
        JSON.stringify({
          localLoginForm: {
            emailId: emailId,
            password: password,
            confirmPassword:confirmPassword
          },
        }), {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      });
      // if (res.status < 300) {
        const data = await res.data;

        this.responseObject = {
          data: data,
          message: "Register user success ",
          result: "SUCCESS",
          status: data.status
        }

      // }
    } catch (error: any) {
      console.log(error);
      const errorResponse = error.response;
      this.responseObject = {
        data: await errorResponse.data,
        message: "Register user failure ",
        result: "FAIL",
        status: errorResponse.status
      }

    }
    console.log(this.responseObject)
    return this.responseObject;
  }
  public  fetchUsersRooms = async (): Promise<APIResponse> => {
    this.responseObject = defaultAPIResponseObject;

    try {
      const res = await axios.get(`${ENV_VAR.PROXY_GATEWAY_URL}${ENV_VAR.GENERAL_EXT}/game/get-rooms`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      })
  
      // if (res.status < 300) {
        // const data = await res.data;
        this.responseObject = {
          data:await res.data,
          message:"Users Room fetched",
          result:"SUCCESS",
          status:res.status
        }
      // } else {
      // }
    }catch (error: any) {
      console.log(error);
      const errorResponse = error.response;
      this.responseObject = {
        data: await errorResponse.data,
        message: "Fetching users room failure ",
        result: "FAIL",
        status: errorResponse.status
      }

    }
    console.log(this.responseObject)
    return this.responseObject;
  
  }

  public  createRoom = async (): Promise<APIResponse> => {
    this.responseObject = defaultAPIResponseObject;

    try {
      const res = await axios.post(ENV_VAR.PROXY_GATEWAY_URL + ENV_VAR.GENERAL_EXT + "/game/create-room", {}, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      })
  
  
      // const data = await res.data;
      this.responseObject = {
        data:await res.data,
        message:"Room created successfully",
        result:"SUCCESS",
        status:res.status
      }
  
    }catch (error: any) {
      console.log(error);
      const errorResponse = error.response;
      this.responseObject = {
        data: await errorResponse.data,
        message: "Creating room failure ",
        result: "FAIL",
        status: errorResponse.status
      }

    }
    console.log(this.responseObject)
    return this.responseObject;
  
  }

  public  isUserInValidRoom = async (roomId: string): Promise<APIResponse> => {
    try {
      const res = await axios.post(`${ENV_VAR.PROXY_GATEWAY_URL}${ENV_VAR.GENERAL_EXT}/game/in-valid-room`
        , {
          roomId: roomId
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      this.responseObject = {
        data:await res.data,
        message:"User room validated",
        result:"SUCCESS",
        status:res.status
      }
    } catch (error: any) {
      console.log(error);
      const errorResponse = error.response;
      this.responseObject = {
        data: await errorResponse.data,
        message: "User Room validity failed ",
        result: "FAIL",
        status: errorResponse.status
      }

    }
    console.log(this.responseObject)
    return this.responseObject;
  }

  public  addUserToRoom = async (roomId: string): Promise<APIResponse> => {
    try {
      const res = await axios.post(`${ENV_VAR.PROXY_GATEWAY_URL}${ENV_VAR.GENERAL_EXT}/game/add-user`
        , {
          roomId: roomId
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      this.responseObject = {
        data:await res.data,
        message:"User added to the room ",
        result:"SUCCESS",
        status:res.status
      }
    } catch (error: any) {
      console.log(error);
      const errorResponse = error.response;
      this.responseObject = {
        data: await errorResponse.data,
        message: "Failed to add user in the room ",
        result: "FAIL",
        status: errorResponse.status
      }

    }
    console.log(this.responseObject)
    return this.responseObject;
  }

  public logoutUserAPI = async (): Promise<APIResponse> => {
    this.responseObject = defaultAPIResponseObject;


    try {
      const res = await axios.post(`${ENV_VAR.PROXY_GATEWAY_URL}${ENV_VAR.AUTH_EXT}/local-signout`,
        JSON.stringify({
   
        }), {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      });
      // if (res.status < 300) {
        const data = await res.data;

        return await this.fetchUserAPI()

      // }
    } catch (error: any) {
      console.log(error);
      const errorResponse = error.response;
      this.responseObject = {
        data: await errorResponse.data,
        message: "User logout failure ",
        result: "FAIL",
        status: errorResponse.status
      }

    }
    console.log(this.responseObject)
    return this.responseObject;
  }


  }

  const userAPICalls = new UserAPICalls();

  export {userAPICalls}




