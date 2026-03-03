import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, CreatePostPayload } from "../../api/post.service";
import { getCategories } from "../../api/category.service";
import { useNavigate } from "react-router-dom";

type FormValues = {
  judul: string;
  isi: string;
  category_id: string;
  gambar: FileList;
};

export default function CreatePostPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset();
      navigate("/admin/posts");
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload: CreatePostPayload = {
      judul: data.judul,
      isi: data.isi,
      category_id: Number(data.category_id),
      gambar: data.gambar[0],
    };

    mutation.mutate(payload);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Tambah Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("judul")} placeholder="Judul" className="w-full border p-2 rounded" />

        <textarea {...register("isi")} placeholder="Isi" className="w-full border p-2 rounded" />

        <select {...register("category_id")} className="w-full border p-2 rounded">
          <option value="">Pilih Kategori</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.nama_kategori}
            </option>
          ))}
        </select>

        <input type="file" {...register("gambar")} className="w-full" />

        <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded">
          Simpan
        </button>
      </form>
    </div>
  );
}