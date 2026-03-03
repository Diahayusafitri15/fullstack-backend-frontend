export interface Post {
    id: number;
    judul: string;
    isi: string;
    gambar: string | null;
    category_id: number;
    created_at?: string;
  }
  
  export interface CreatePostInput {
    judul: string;
    isi: string;
    category_id: string;
    gambar: FileList;
  }