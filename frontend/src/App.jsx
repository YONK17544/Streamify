import { Routes, Route, Navigate } from "react-router"
import HomePage from "./pages/HomePage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import LogInPage from "./pages/LogInPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import OnBoardingPage from "./pages/OnBoardingPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser.js"
import LayOut from "./components/LayOut.jsx"

function App() {

  const {isLoading, authUser} = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  
  if(isLoading) return <PageLoader/>

  return (
    <div className = "h-screen" data-theme = "forest">
      <Routes>
        <Route path = "/" element = { 
          isAuthenticated && isOnboarded ? (
          <LayOut showSidebar = {true}>
            <HomePage/>
          </LayOut>
        ) : 
        <Navigate to = {!isAuthenticated ? "/login" : "/onboarding"}/>
        }/>
        <Route path = "/signup" element = { !isAuthenticated ? <SignUpPage/> : <Navigate to = { isOnboarded ? "/" : "/onboarding"}/>}/>
        <Route path = "/login" element = {!isAuthenticated ? <LogInPage/> : <Navigate
        to = { isOnboarded ? "/" : "/onboarding"}/>}/>
        <Route path = "/notifications" element = { isAuthenticated ? <NotificationsPage/> : <Navigate to = "/login"/>}/>
        <Route path = "/onboarding" element = 
        { isAuthenticated ? (!isOnboarded ? <OnBoardingPage/> : <Navigate to = "/"/>): <Navigate to = "/login"/>}/>
        <Route path = "/call" element = { isAuthenticated ? <CallPage/>:<Navigate to = "/login"/>}/>
        <Route path = "/chat" element = { isAuthenticated ?<ChatPage/> : <Navigate to = "/login"/>}/>
        {/* Add more routes as needed */}
      </Routes>

      <Toaster/>
      
    </div>
  )
}

export default App