import "./App.css";
import Home from "./Pages/Home";
import AuthUserProvider from "./auth/AuthUserProvider";
function App() {
    return (
        <div>
        <AuthUserProvider>
        <Home></Home>
        </AuthUserProvider>
         

        </div>
    );
}

export default App;