import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../api/postService';

const postSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  isi: z.string().min(1, "Isi wajib diisi"),
  category_id: z.string().min(1, "Pilih kategori"),
  gambar: z.any().refine((files) => files?.length > 0, "Gambar wajib diunggah"),
});

export const PostForm = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(postSchema)
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      reset();
      alert("Post berhasil dibuat! ✨");
    }
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('judul', data.judul);
    formData.append('isi', data.isi);
    formData.append('category_id', data.category_id);
    formData.append('gambar', data.gambar[0]); // Ambil file pertama

    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-[28px] shadow-sm border border-pink-50 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Buat Post Baru</h2>
      
      <div className="space-y-4">
        <input {...register('judul')} placeholder="Judul Postingan" className="w-full p-3 rounded-xl border border-pink-100 focus:outline-pink-300" />
        {errors.judul && <p className="text-red-400 text-xs">{errors.judul.message as string}</p>}

        <textarea {...register('isi')} placeholder="Apa yang ingin kamu bagikan?" className="w-full p-3 rounded-xl border border-pink-100 h-24 focus:outline-pink-300" />
        
        <input {...register('category_id')} placeholder="ID Kategori (contoh: 1)" className="w-full p-3 rounded-xl border border-pink-100 focus:outline-pink-300" />

        <div className="p-4 border-2 border-dashed border-pink-100 rounded-xl">
          <input type="file" {...register('gambar')} className="text-sm text-gray-500" />
        </div>

        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full py-3 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all"
        >
          {mutation.isPending ? "Mengirim..." : "Publish Post"}
        </button>
      </div>
    </form>
  );
};