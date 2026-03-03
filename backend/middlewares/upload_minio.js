const multer = require('multer');
const sharp = require('sharp');
const Minio = require('minio');
require('dotenv').config(); // Memastikan file .env terbaca

// 1. Konfigurasi MinIO Client menggunakan data dari .env
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT) || 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

const bucketName = process.env.MINIO_BUCKET || 'my-bucket';

// 2. Fungsi Otomatis untuk Mengubah ke PUBLIC (Tetap Diperlukan)
const ensureBucketPublic = async () => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName);
            console.log(`📁 Bucket '${bucketName}' baru saja dibuat.`);
        }

        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetBucketLocation", "s3:ListBucket"],
                    Resource: [`arn:aws:s3:::${bucketName}`],
                },
                {
                    Effect: "Allow",
                    Principal: { AWS: ["*"] },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        };

        await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
        console.log(`✅ SUCCESS: Bucket '${bucketName}' sekarang sudah PUBLIC.`);
    } catch (err) {
        console.error(`❌ ERROR Policy: ${err.message}`);
    }
};

ensureBucketPublic();

// 3. Konfigurasi Multer (Memory Storage)
const upload = multer({ storage: multer.memoryStorage() });

// 4. Middleware Upload & Konversi ke WebP
const uploadToMinio = async (req, res, next) => {
    if (!req.file) return next();

    try {
        // Konversi buffer gambar ke format WebP menggunakan Sharp
        const webpBuffer = await sharp(req.file.buffer)
            .webp({ quality: 80 })
            .toBuffer();

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = `post-${uniqueSuffix}.webp`;

        // Simpan file ke MinIO
        await minioClient.putObject(bucketName, fileName, webpBuffer, webpBuffer.length, {
            'Content-Type': 'image/webp'
        });

        /** * PERBAIKAN UTAMA: Sesuai instruksi Kak Sigit, 
         * database hanya menyimpan nama bucket dan nama filenya saja (Path).
         */
        req.file.minioPath = `${bucketName}/${fileName}`; 
        
        next();
    } catch (error) {
        return res.status(500).json({ 
            message: "Gagal memproses dan upload gambar", 
            error: error.message 
        });
    }
};

module.exports = {
    upload,
    uploadToMinio
};