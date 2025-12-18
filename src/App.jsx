import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ParcelDetailsPage from './pages/ParcelDetailsPage';
import BookParcelPage from './pages/BookParcelPage';

import PersistLogin from './components/PersistLogin';
import Layout from './components/Layout';

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<PersistLogin />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/book-parcel" element={<BookParcelPage />} />
                        <Route path="/parcels/:id" element={<ParcelDetailsPage />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
