import { Route ,Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function UnauthenticatedApp(){
    return(
        <div>
            <Routes>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="*" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage/>}/>
            </Routes>

        </div>
    )
}

export default UnauthenticatedApp