import { Route ,Routes } from "react-router-dom";

 function AuthenticatedApp(){
    return(
        <div>
            <Routes>
                <Route path="/book" element={<HomePage/>}/>
            </Routes>
        </div>
    )
 }

export default AuthenticatedApp