import axios from "axios";

const API_KEY = "MASUKKAN_API_KEY_RAJAONGKIR_KAMU"; // Ambil dari dashboard RajaOngkir
const BASE_URL = "https://api.rajaongkir.com/starter";

export const getProvinces = async () => {
  const response = await axios.get(`${BASE_URL}/province`, {
    headers: { key: API_KEY }
  });
  return response.data.rajaongkir.results;
};

export const getCities = async (provinceId: string) => {
  const response = await axios.get(`${BASE_URL}/city?province=${provinceId}`, {
    headers: { key: API_KEY }
  });
  return response.data.rajaongkir.results;
};