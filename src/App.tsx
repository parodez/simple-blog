import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import BlogList from './pages/Blog/BlogList';
// import BlogForm from './pages/Blog/BlogForm';
// import BlogDetail from './pages/Blog/BlogDetail';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/blog' element={<BlogList />} />
          {/* <Route path='/blog/new' element={<BlogForm />} /> */}
          {/* <Route path='/blog/:id' element={<BlogDetail />} /> */}
          {/* <Route path='/blog/edit/:id' element={<BlogForm />} /> */}
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
