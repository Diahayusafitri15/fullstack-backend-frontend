import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../../api/post.service";
import { getCategories } from "../../api/category.service";

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
    queryFn: () => getPostById(Number(id)),
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
    mutationFn: (formData: FormData) => updatePost(Number(id), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/admin/posts");
    },
  });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("isi", data.isi);
    formData.append("category_id", String(data.category_id));

    if (data.gambar && data.gambar.length > 0) {
      formData.append("gambar", data.gambar[0]);
    }

    mutation.mutate(formData);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("judul")} className="w-full border p-2 rounded" />
        <textarea {...register("isi")} className="w-full border p-2 rounded" />

        <select {...register("category_id")} className="w-full border p-2 rounded">
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.nama_kategori}
            </option>
          ))}
        </select>

        <input type="file" {...register("gambar")} />

        <button className="w-full bg-pink-500 text-white py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}