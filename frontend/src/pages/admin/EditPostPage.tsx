import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost, getCategories } from "../../api/post.service";

type FormValues = {
  judul: string;
  isi: string;
  category_id: number;
  gambar?: FileList;
};

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { data: post } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(String(id)),
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (post) {
      reset({
        judul: post.judul,
        isi: post.isi,
        category_id: post.category_id,
      });
    }
  }, [post, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => updatePost(String(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/admin/posts");
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      judul: data.judul,
      isi: data.isi,
      category_id: String(data.category_id),
      gambar: data.gambar && data.gambar.length > 0 ? data.gambar[0] : null,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-50 mt-10">
      <h1 className="text-2xl font-black text-gray-800 mb-8 border-l-4 border-pink-500 pl-4 uppercase italic tracking-tighter">Edit Souvenir</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Judul</label>
          <input {...register("judul")} className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-pink-300 outline-none transition-all" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Isi / Deskripsi</label>
          <textarea {...register("isi")} rows={4} className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-pink-300 outline-none transition-all" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Kategori</label>
          <select {...register("category_id")} className="w-full border-2 border-gray-50 p-3 rounded-2xl focus:border-pink-300 outline-none transition-all bg-white">
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.nama_kategori}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">File: {post?.gambar?.split('/').pop()}</label>
          <input type="file" {...register("gambar")} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-600" />
        </div>

        <button disabled={mutation.isPending} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-100 transition-all uppercase tracking-widest active:scale-95 disabled:bg-gray-200">
          {mutation.isPending ? "Updating..." : "Update Souvenir"}
        </button>
      </form>
    </div>
  );
}