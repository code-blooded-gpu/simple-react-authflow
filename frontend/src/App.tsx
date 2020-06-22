import React, {Suspense, useEffect} from "react";
import {
   BrowserRouter as Router,
   Switch,
   Route,
   Redirect
} from "react-router-dom";


import "./App.css";
import Navigation from "./containers/Navigation";
import Home from "./containers/Home";
import Layout from "./containers/Layout";
import { useAuthContext, AuthContext } from "./shared/hooks/AuthContext-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import axios from "./util/axios";

const Login = React.lazy(() => import("./containers/Login"));
const SignUp = React.lazy(() => import("./containers/SignUp"));
const Profile = React.lazy(() => import("./containers/Profile"));
function App() {
   const [
      accesstoken,
      login,
      logout,
      error,
      setErrorMessage
   ] = useAuthContext();

   useEffect(()=>{
      const autoLogin = async ()=>{
         let response;
         try{
            response = await axios({url : "/user/refresh_token", method : "get"}) 
            if(response.data.accesstoken) login(response.data.accesstoken);
         }catch(err){
         }
      }
      if(!accesstoken) autoLogin();
   },[login, accesstoken]);



   let route;
   if (accesstoken) {
      route = (
         <Switch>
            <Route path="/home" component={Home} exact />
            <Route path="/profile" component={Profile} exact />
            <Redirect to="/home" />
         </Switch>
      );
   } else {
      route = (
         <Switch>
            <Route path="/home" component={Home} exact />
            <Route path="/signup" component={SignUp} exact />
            <Route path="/login" component={Login} exact />
            <Redirect to="/home" />
         </Switch>
      );
   }

   return (
      <AuthContext.Provider
         value={{ accesstoken, login, logout, error, setErrorMessage }}
      >
         <Layout>
            <Router>
               <Navigation />
               <main><Suspense fallback={<LoadingSpinner/>}>{route}</Suspense></main>
            </Router>
         </Layout>
      </AuthContext.Provider>
   );
}

export default App;
