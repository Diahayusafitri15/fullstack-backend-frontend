import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, deletePost, Post } from "../../api/post.service";
import { useNavigate } from "react-router-dom";

export default function Posts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Yakin ingin hapus post ini?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Daftar Post</h1>
        <button
          onClick={() => navigate("/admin/posts/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tambah Post
        </button>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-xl shadow">
            <img
              src={post.gambar}
              alt={post.judul}
              className="w-full h-48 object-cover rounded mb-4"
            />

            <h2 className="text-lg font-semibold">{post.judul}</h2>

            <p className="text-sm text-gray-500">
              Kategori: {post.nama_kategori}
            </p>

            <p className="mt-2">{post.isi}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate(`/admin/posts/${post.id}`)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}