import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// PERBAIKAN: Gunakan ../ untuk keluar dari folder 'pages'
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Login = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Password sederhana untuk akses admin SOUVNELA
    if (password === "admin123") { 
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/admin');
    } else {
      alert("Password salah, Diah! Coba 'admin123'");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4 font-sans">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-pink-500 text-white p-10 text-center">
          <CardTitle className="text-3xl font-black italic tracking-tighter">SOUVNELA.</CardTitle>
          <p className="text-pink-100 text-xs mt-2 uppercase tracking-widest font-bold">Admin Login</p>
        </CardHeader>
        <CardContent className="p-10 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="password" 
              placeholder="Admin Password" 
              className="border-pink-100 focus:ring-pink-400 rounded-xl py-6 text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl py-6 font-bold shadow-lg shadow-pink-200 transition-all">
              MASUK KE DASHBOARD
            </Button>
          </form>
          <button onClick={() => navigate('/')} className="w-full text-pink-400 text-xs hover:underline">
            ← Kembali ke Beranda User
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;