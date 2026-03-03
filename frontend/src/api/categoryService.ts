export interface Category {
    id: number;
    nama_kategori: string;
}

// PASTIKAN ADA KATA 'EXPORT' DI SINI
export interface ApiResponse<T> {
    status: string;
    message?: string;
    data: T;
}