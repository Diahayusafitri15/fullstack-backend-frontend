import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../api/post.service";
import Navbar from "../../components/Navbar";
import { MapPin, PackageCheck, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const API_WILAYAH = "https://www.emsifa.com/api-wilayah-indonesia/api";
// Sesuai dengan perbaikan index.js backend (menggunakan prefix /api)
const API_BASE_URL = "http://localhost:3000/api"; 

export default function CheckoutPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const qty = parseInt(queryParams.get("qty") || "1");

  // State Data Wilayah
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  // State Pilihan User
  const [selectedProv, setSelectedProv] = useState({ id: "", name: "" });
  const [selectedKota, setSelectedKota] = useState({ id: "", name: "" });
  const [selectedKec, setSelectedKec] = useState({ id: "", name: "" });
  const [selectedDesa, setSelectedDesa] = useState({ id: "", name: "" });
  const [kodePos, setKodePos] = useState("");
  const [alamatDetail, setAlamatDetail] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Wilayah Logic
  useEffect(() => {
    axios.get(`${API_WILAYAH}/provinces.json`).then(res => setProvinces(res.data));
  }, []);

  useEffect(() => {
    if (selectedProv.id) {
      setRegencies([]); setSelectedKota({ id: "", name: "" });
      axios.get(`${API_WILAYAH}/regencies/${selectedProv.id}.json`).then(res => setRegencies(res.data));
    }
  }, [selectedProv.id]);

  useEffect(() => {
    if (selectedKota.id) {
      setDistricts([]); setSelectedKec({ id: "", name: "" });
      axios.get(`${API_WILAYAH}/districts/${selectedKota.id}.json`).then(res => setDistricts(res.data));
    }
  }, [selectedKota.id]);

  useEffect(() => {
    if (selectedKec.id) {
      setVillages([]); setSelectedDesa({ id: "", name: "" });
      axios.get(`${API_WILAYAH}/villages/${selectedKec.id}.json`).then(res => setVillages(res.data));
    }
  }, [selectedKec.id]);

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id!),
  });

  // Pastikan harga dikonversi ke number sebelum dikali
  const totalBayar = Number(post?.harga || 0) * qty;

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Sesi kamu habis, silakan login ulang ya! ✨");
      navigate('/login');
      return;
    }

    // Validasi Lengkap sebelum kirim (Mencegah Error 400)
    if (!selectedProv.name || !selectedKota.name || !selectedKec.name || !selectedDesa.name || !alamatDetail) {
      alert("Mohon lengkapi alamat pengiriman sampai Desa/Kelurahan ya! 🌸");
      return;
    }

    setIsSubmitting(true);
    try {
      // Data disesuaikan persis dengan kebutuhan order_controller.js
      const orderData = {
        post_id: parseInt(id!), 
        qty: qty,
        total_bayar: totalBayar, // Mengirim angka murni
        provinsi: selectedProv.name,
        kota: selectedKota.name,
        kecamatan: selectedKec.name,
        desa: selectedDesa.name,
        kode_pos: kodePos,
        alamat_lengkap: alamatDetail // Kode pos sudah ada di kolom sendiri
      };

      const response = await axios.post(`${API_BASE_URL}/orders/create`, orderData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status === "success") {
        alert("Pesanan Berhasil Dibuat! 🎉");
        navigate('/my-orders'); 
      }
    } catch (error: any) {
      console.error("Detail Error:", error.response?.data || error.message);
      const serverMessage = error.response?.data?.message || "Terjadi kesalahan pada server.";
      alert(`Gagal Membuat Pesanan: ${serverMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-pink-50">
      <Loader2 className="animate-spin text-pink-500 mb-4" size={48} />
      <p className="text-pink-500 font-black text-xs uppercase tracking-widest animate-pulse">Menyiapkan Pesananmu...</p>
    </div>
  );

  return (
    <div className="bg-[#fffafa] min-h-screen pb-20 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32">
        
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors font-bold text-xs uppercase tracking-widest">
            <ArrowLeft size={16} /> Kembali
        </button>

        <div className="mb-10 flex items-center gap-4">
            <div className="bg-pink-500 p-3 rounded-2xl shadow-lg shadow-pink-100">
                <PackageCheck className="text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter">Final <span className="text-pink-500">Checkout</span></h1>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Satu langkah lagi menuju souvenir cantikmu</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* FORM ALAMAT */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[45px] border border-pink-50 shadow-xl shadow-pink-100/10">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-3 italic tracking-tighter mb-8 uppercase">
                <MapPin className="text-pink-500" size={20} /> Informasi Pengiriman
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Provinsi</label>
                  <select 
                    value={selectedProv.id}
                    onChange={(e) => {
                      const item = provinces.find(p => p.id === e.target.value);
                      setSelectedProv({ id: e.target.value, name: item?.name || "" });
                    }}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kota / Kabupaten</label>
                  <select 
                    disabled={!selectedProv.id}
                    value={selectedKota.id}
                    onChange={(e) => {
                      const item = regencies.find(r => r.id === e.target.value);
                      setSelectedKota({ id: e.target.value, name: item?.name || "" });
                    }}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold disabled:opacity-30 outline-none focus:ring-2 focus:ring-pink-200"
                  >
                    <option value="">Pilih Kota</option>
                    {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kecamatan</label>
                  <select 
                    disabled={!selectedKota.id}
                    value={selectedKec.id}
                    onChange={(e) => {
                      const item = districts.find(d => d.id === e.target.value);
                      setSelectedKec({ id: e.target.value, name: item?.name || "" });
                    }}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold disabled:opacity-30 outline-none focus:ring-2 focus:ring-pink-200"
                  >
                    <option value="">Pilih Kecamatan</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Desa / Kelurahan</label>
                  <select 
                    disabled={!selectedKec.id}
                    value={selectedDesa.id}
                    onChange={(e) => {
                      const item = villages.find(v => v.id === e.target.value);
                      setSelectedDesa({ id: e.target.value, name: item?.name || "" });
                    }}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold disabled:opacity-30 outline-none focus:ring-2 focus:ring-pink-200"
                  >
                    <option value="">Pilih Desa</option>
                    {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kode Pos</label>
                  <input type="text" value={kodePos} onChange={(e) => setKodePos(e.target.value)} placeholder="Contoh: 35361" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-pink-200 transition-all" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Lengkap (Nama Jalan/Blok/No)</label>
                  <textarea value={alamatDetail} onChange={(e) => setAlamatDetail(e.target.value)} className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[30px] h-32 text-sm font-bold outline-none focus:ring-2 focus:ring-pink-200 transition-all" placeholder="Jl. Ahmad Yani No. 10..."></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR RINGKASAN */}
          <div className="lg:col-span-1">
            <div className="bg-white p-10 rounded-[45px] border border-pink-50 shadow-2xl shadow-pink-100/20 sticky top-32">
              <h2 className="text-xl font-black text-gray-800 uppercase italic mb-8">Ringkasan</h2>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 font-black shadow-inner">#{post?.id}</div>
                        <div>
                            <p className="text-xs font-black text-gray-800 uppercase italic leading-tight">{post?.judul}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{qty}x Barang</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-dashed border-gray-200 space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <span>Harga Satuan</span>
                        <span>Rp {Number(post?.harga || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <span>Biaya Layanan</span>
                        <span className="text-green-500 uppercase italic">Free</span>
                    </div>
                </div>

                <div className="pt-6 mt-6 border-t-2 border-pink-500/20">
                    <span className="block text-pink-500 font-black italic uppercase text-[10px] mb-1">Total Pembayaran</span>
                    <span className="text-3xl font-black text-pink-600 italic tracking-tighter">Rp {totalBayar.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmOrder}
                disabled={isSubmitting || !selectedDesa.name || !alamatDetail}
                className="w-full bg-pink-500 text-white py-7 rounded-[25px] font-black text-xs tracking-[0.2em] uppercase transition-all shadow-xl shadow-pink-200 hover:-translate-y-1 active:scale-95 disabled:bg-gray-200 disabled:shadow-none flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        Processing...
                    </>
                ) : (
                    <>Konfirmasi Order 🚀</>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                  <Sparkles size={12} className="text-pink-300" /> Secure Payment Souvnela
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}