export interface Category {
    id: number;
    nama_kategori: string;
}

export interface ApiResponse<T> {
    status: string;
    message?: string;
    data: T;
}