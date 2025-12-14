import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import PersistLogin from './components/PersistLogin';

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<PersistLogin />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
