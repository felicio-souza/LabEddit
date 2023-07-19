import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../components/loginpage/LoginPage";


export const Router = () =>{


    return(

    <BrowserRouter>
        <Routes>
         <Route path="/login" element={<LoginPage />} />

        </Routes>
    
    </BrowserRouter>

    )
}