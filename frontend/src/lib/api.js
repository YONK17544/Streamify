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

export const getUserFriends = async () => {
      const res = await axiosInstance.get("/users/friends");
      return res.data;
}

export const getRecommendedUsers = async () => {
      const res = await axiosInstance.get("/users");
      return res.data;
}

export const getOutgoingFriendReqs = async () => {
      const res = await axiosInstance.get("/users/outgoing-friend-requests");
      return res.data;
}

export const sendFriendRequest = async (userId) => {
      const res = await axiosInstance.post(`/users/friend-request/${userId}`);
      return res.data;
}

export const getFriendRequests = async () => {
      const res = await axiosInstance.get("/users/friend-requests");
      return res.data;
}

export const acceptFriendRequest = async (requestId) => {
      const res = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
      return res.data;
}

export const getStreamToken = async () =>{
      const res = await axiosInstance.get("/chat/token");
      return res.data;
}

export const getStreamVideoToken = async () => {
  const res = await axiosInstance.get("/chat/vid-token", {
    withCredentials: true, // if you're using cookies for auth
  });

  return res.data; // Match structure expected by useQuery
};