import { Routes, Route, Navigate } from "react-router"
import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LogInPage from "./pages/LogInPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import OnBoardingPage from "./pages/OnBoardingPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios.js"

function App() {
  //tanstack query
  const {data: authData, isLoading, error} = useQuery({
    queryKey: ["authUser"],

    queryFn: async () =>{
      const res = await axiosInstance.get("/auth/me");
      
      return res.data;
    },
    retry: false
  });

  const authUser = authData?.user;

  return (
    <div className = "h-screen" data-theme = "forest">
      <Routes>
        <Route path = "/" element = { authUser ? <HomePage/> : <Navigate to = "/login"/>}/>
        <Route path = "/signup" element = { !authUser ? <SignUpPage/> : <Navigate to = "/"/>}/>
        <Route path = "/login" element = { !authUser ? <LogInPage/> : <Navigate to = "/"/>}/>
        <Route path = "/notifications" element = { authUser ? <NotificationsPage/> : <Navigate to = "/login"/>}/>
        <Route path = "/onboarding" element = { authUser ? <OnBoardingPage/> : <Navigate to = "/login"/>}/>
        <Route path = "/call" element = { authUser ? <CallPage/>:<Navigate to = "/login"/>}/>
        <Route path = "/chat" element = { authUser ?<ChatPage/> : <Navigate to = "/login"/>}/>
        {/* Add more routes as needed */}
      </Routes>

      <Toaster/>
      
    </div>
  )
}

export default App