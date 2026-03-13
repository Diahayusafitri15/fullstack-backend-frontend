import { useEffect, useState } from 'react';
// PERBAIKAN: Gunakan axiosInstance, bukan axios biasa
import axiosInstance from "../../api/axios"; // Naik 2 tingkat ke folder src, baru masuk ke api 
import { ClipboardList, Clock, Truck, CheckCircle, Package, AlertCircle } from 'lucide-react';

// Interface disesuaikan dengan field di database kita
interface Order {
  id: number;
  total_bayar: number;
  kota: string;
  kecamatan: string;
  status: 'pending' | 'dikirim' | 'selesai' | string;
  created_at: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      
      /**
       * PERBAIKAN: 
       * Tidak perlu lagi ambil token manual & set header manual.
       * axiosInstance sudah melakukan itu secara otomatis di interceptor.
       * URL juga cukup "/orders/my-orders" karena baseURL sudah ".../api"
       */
      const response = await axiosInstance.get('/orders/my-orders');
      
      // Backend kita mengembalikan { status: "success", data: [...] }
      if (response.data && response.data.data) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
      }
      
      setError(null);
    } catch (err: any) {
      console.error("Gagal memuat pesanan", err);
      // Jika error 401 (Unauthorized), bisa arahkan ke login
      if (err.response?.status === 401) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
      } else {
        const message = err.response?.data?.message || "Gagal mengambil data pesanan.";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchMyOrders(); 
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffafa]">
      <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
      <p className="text-pink-500 font-black animate-pulse uppercase tracking-widest text-[10px]">Memuat Riwayat Pesanan... 🌸</p>
    </div>
  );

  return (
    <div className="pt-28 pb-20 px-6 min-h-screen bg-[#fffafa]">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-pink-600 p-3 rounded-2xl shadow-lg shadow-pink-200">
            <ClipboardList className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase">
              Riwayat <span className="text-pink-600">Pesanan</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Pantau status souvenir MANCEGINE kamu di sini
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 mb-6">
            <AlertCircle size={18} />
            <p className="text-[10px] font-bold uppercase">{error}</p>
          </div>
        )}

        {/* ORDER LIST */}
        <div className="grid gap-6">
          {orders.length === 0 && !error ? (
            <div className="bg-white border-2 border-dashed border-pink-100 rounded-[32px] p-20 text-center">
              <Package className="mx-auto text-pink-200 mb-4" size={48} />
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                Belum ada pesanan nih. Yuk belanja dulu! 💖
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border border-pink-50 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 font-black text-xl shadow-inner border border-pink-100">
                      #{order.id}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight">Pesanan Souvenir</h3>
                      <p className="text-pink-600 font-black text-sm mt-1">
                        Rp {Number(order.total_bayar).toLocaleString('id-ID')}
                      </p>
                      <p className="text-gray-400 text-[9px] font-bold uppercase mt-2 tracking-wider">
                        Tujuan: {order.kota}, {order.kecamatan}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                      order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      order.status === 'dikirim' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {order.status === 'pending' && <Clock size={12} />}
                      {order.status === 'dikirim' && <Truck size={12} />}
                      {order.status === 'selesai' && <CheckCircle size={12} />}
                      {order.status}
                    </div>
                    <span className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">
                      {order.created_at ? 
                        `Dipesan pada: ${new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}` 
                        : 'Tanggal tidak tersedia'}
                    </span>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}