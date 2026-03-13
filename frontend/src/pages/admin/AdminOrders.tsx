import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, RefreshCcw, Trash2, CheckCircle, Truck, Clock, AlertCircle } from 'lucide-react';

// 1. Definisi Interface untuk TypeScript agar tidak ada error 'any'
interface Order {
  id: number;
  total_bayar: number | string;
  kota: string;
  alamat_lengkap: string;
  status: 'pending' | 'diproses' | 'dikirim' | 'selesai';
  created_at?: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/orders/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Pastikan response.data.data ada sebelum di-set
      setOrders(response.data.data || []);
    } catch (err: any) {
      console.error("Gagal mengambil data pesanan", err);
      setError("Gagal memuat data. Pastikan koneksi backend aktif.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!newStatus) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/orders/admin/status/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Status pesanan #${id} berhasil diupdate! ✨`);
      fetchOrders(); 
    } catch (error) {
      alert("Gagal memperbarui status. Coba lagi nanti.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus pesanan ini? Tindakan ini tidak bisa dibatalkan! 🗑️")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/orders/admin/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrders();
      } catch (error) {
        alert("Gagal menghapus pesanan");
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fff5f8]">
      <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
      <p className="text-pink-500 font-black animate-pulse uppercase tracking-widest text-xs">Memproses Data Pesanan...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#fff5f8] min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-[40px] shadow-2xl shadow-pink-100/40 p-6 md:p-10 border border-pink-50">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tighter flex items-center gap-3">
              <div className="bg-pink-600 p-2.5 rounded-2xl text-white shadow-lg shadow-pink-200 rotate-3 group-hover:rotate-0 transition-transform">
                <ShoppingBag size={24} />
              </div>
              KELOLA <span className="text-pink-600 italic">ORDERS</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
              Mancegine Printing Management v.1.0
            </p>
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center gap-2 px-5 py-3 bg-pink-50 text-pink-600 rounded-2xl hover:bg-pink-600 hover:text-white transition-all duration-300 font-bold text-xs shadow-sm border border-pink-100"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            REFRESH DATA
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* TABLE WRAPPER */}
        <div className="overflow-x-auto rounded-[30px] border border-pink-50 shadow-inner bg-gray-50/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-600 text-white">
                <th className="p-5 text-[10px] font-black uppercase tracking-widest rounded-tl-[30px]">ID</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Total Bayar</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Detail Pengiriman</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center rounded-tr-[30px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <ShoppingBag size={48} className="mb-4 text-pink-300" />
                      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Belum ada pesanan masuk 🍥</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-pink-50/30 transition-all border-b border-pink-50/50">
                    <td className="p-5">
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black italic">
                        #{order.id}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="text-pink-600 font-black text-sm">
                        Rp {Number(order.total_bayar).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="text-[11px] font-black text-gray-700 uppercase tracking-tight">{order.kota}</div>
                      <div className="text-[10px] text-gray-400 leading-tight mt-1 max-w-[200px] truncate hover:whitespace-normal transition-all" title={order.alamat_lengkap}>
                        {order.alamat_lengkap}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                        order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        order.status === 'dikirim' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {order.status === 'pending' && <Clock size={10} />}
                        {order.status === 'dikirim' && <Truck size={10} />}
                        {(order.status === 'selesai' || order.status === 'diproses') && <CheckCircle size={10} />}
                        {order.status}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-3">
                        <div className="relative group">
                          <select 
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            value={order.status}
                            className="text-[10px] font-black uppercase pl-3 pr-8 py-2.5 bg-white border border-pink-100 rounded-2xl outline-none focus:ring-4 focus:ring-pink-100 transition-all appearance-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="diproses">Proses</option>
                            <option value="dikirim">Kirim</option>
                            <option value="selesai">Selesai</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400">
                             <Clock size={10} />
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDelete(order.id)}
                          className="p-2.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm border border-red-100"
                          title="Hapus Pesanan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* FOOTER INFO */}
        <div className="mt-8 flex justify-between items-center text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            <span>Total: {orders.length} Pesanan</span>
            <span>Last Sync: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;