import { axiosInstance } from "./axios.js";

export const signup = async (signupData) =>{
      const res = await axiosInstance.post("/auth/signup", signupData);
      return res.data;
}

export const login = async (loginData) =>{
      const res = await axiosInstance.post("/auth/login", loginData);
      return res.data;
}
export const logout = async () =>{
      const res = await axiosInstance.post("/auth/logout");
      return res.data;
}

export const getAuthUser = async () =>{
      try {
        const res = await axiosInstance.get("/auth/me");      
        return res.data;
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
        return null; // Re-throw the error to handle it in the calling function
      }
}

export const completeOnboarding = async (userData) => {
      const response = await axiosInstance.post("/auth/onboarding", userData);
      return response.data;
}



