const Category = require('../models/category_model');
const { validationResult } = require('express-validator');
const response = require('../utils/response');

/**
 * =========================
 * GET ALL CATEGORIES
 * =========================
 */
const getAllCategories = async (req, res) => {
  try {
    const data = await Category.getAll();
    return response.success(res, data, "Berhasil mengambil data kategori");
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    return response.error(res, "Terjadi kesalahan pada server", 500);
  }
};

/**
 * =========================
 * GET CATEGORY BY ID
 * =========================
 */
const getCategoryById = async (req, res) => {
  try {
    const data = await Category.getById(req.params.id);

    if (!data) {
      return response.error(res, "Kategori tidak ditemukan", 404);
    }

    return response.success(res, data, "Berhasil mengambil kategori");
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);
    return response.error(res, "Terjadi kesalahan pada server", 500);
  }
};

/**
 * =========================
 * CREATE CATEGORY
 * =========================
 */
const createCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return response.error(res, errors.array(), 400);
  }

  try {
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
      return response.error(res, "Nama kategori wajib diisi", 400);
    }

    const data = await Category.create(nama_kategori);

    return response.success(res, data, "Kategori berhasil dibuat", 201);

  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    return response.error(res, "Terjadi kesalahan pada server", 500);
  }
};

/**
 * =========================
 * UPDATE CATEGORY
 * =========================
 */
const updateCategory = async (req, res) => {
  try {
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
      return response.error(res, "Nama kategori wajib diisi", 400);
    }

    const data = await Category.update(req.params.id, nama_kategori);

    if (!data) {
      return response.error(res, "Kategori tidak ditemukan", 404);
    }

    return response.success(res, data, "Kategori berhasil diperbarui");

  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    return response.error(res, "Terjadi kesalahan pada server", 500);
  }
};

/**
 * =========================
 * DELETE CATEGORY
 * =========================
 */
const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.delete(req.params.id);

    if (!deleted) {
      return response.error(res, "Kategori tidak ditemukan", 404);
    }

    return response.success(res, null, "Kategori berhasil dihapus");

  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    return response.error(res, "Terjadi kesalahan pada server", 500);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};