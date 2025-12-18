import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ParcelDetailsPage from './pages/ParcelDetailsPage';

import PersistLogin from './components/PersistLogin';

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<PersistLogin />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/parcels/:id" element={<ParcelDetailsPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
