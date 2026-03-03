import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// PERBAIKAN: Path import disesuaikan keluar satu tingkat
import { getPosts, getCategories, createPost, Category } from '../api/postService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);

  // Proteksi Halaman Admin
  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) navigate('/login');
  }, [navigate]);

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setJudul(''); setIsi(''); setCategoryId(''); setGambar(null);
      alert('Produk berhasil dipublish! ✨');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('isi', isi);
    formData.append('category_id', categoryId);
    if (gambar) formData.append('gambar', gambar);
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-pink-100 p-6 space-y-8 hidden md:block">
        <h1 className="text-xl font-black text-pink-600 italic">ADMIN PANEL</h1>
        <nav className="space-y-4">
          <div className="bg-pink-50 text-pink-600 p-3 rounded-xl font-bold text-sm">Dashboard</div>
          <button onClick={() => { localStorage.removeItem('isLoggedIn'); navigate('/login'); }} className="text-red-400 p-3 text-sm hover:bg-red-50 w-full text-left rounded-xl">Logout</button>
        </nav>
      </div>

      {/* Form Input */}
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-xl rounded-[2rem]">
            <CardHeader><CardTitle className="text-2xl font-bold text-gray-800">Input Produk SOUVNELA</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input placeholder="Nama Produk" value={judul} onChange={(e) => setJudul(e.target.value)} className="rounded-xl" />
                <Textarea placeholder="Deskripsi..." value={isi} onChange={(e) => setIsi(e.target.value)} className="rounded-xl min-h-[120px]" />
                <Select onValueChange={setCategoryId} value={categoryId}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: Category) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>{cat.nama_kategori}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="file" accept="image/*" onChange={(e) => setGambar(e.target.files?.[0] || null)} className="rounded-xl py-2" />
                <Button type="submit" disabled={mutation.isPending} className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl py-6 font-bold shadow-lg">
                  {mutation.isPending ? 'Mempublikasikan...' : 'PUBLISH POST'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;