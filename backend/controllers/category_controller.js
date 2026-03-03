const Category = require('../models/category_model');
const { validationResult } = require('express-validator');
const response = require('../utils/response');

const getAll = async (req, res) => {
    try {
        const data = await Category.getAll();
        response.success(res, data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const data = await Category.getById(req.params.id);
        if (!data) return res.status(404).json({ message: "Kategori tidak ditemukan" });
        response.success(res, data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const data = await Category.create(req.body.nama_kategori);
        response.success(res, data, 'Kategori berhasil dibuat');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const data = await Category.update(req.params.id, req.body.nama_kategori);
        if (!data) return res.status(404).json({ message: "Kategori tidak ditemukan" });
        response.success(res, data, 'Kategori berhasil diperbarui');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const deleted = await Category.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Kategori tidak ditemukan" });
        response.success(res, null, 'Kategori berhasil dihapus');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAll, getById, create, update, remove };