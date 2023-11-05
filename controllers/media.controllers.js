const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const imagekit = require('../libs/imagekit');
const path = require('path');


module.exports = {
    singleUpload: (req, res) => {
        let folder = req.file.destination.split('public/')[1];
        const fileUrl = `${req.protocol}://${req.get('host')}/${folder}/${req.file.filename}`;

        return res.json({
            status: true,
            message: 'OK',
            error: null,
            data: { file_url: fileUrl }
        });
    },

    multiUpload: (req, res) => {
        let fileUrls = [];
        req.files.forEach(file => {
            let folder = file.destination.split('public/')[1];
            const fileUrl = `${req.protocol}://${req.get('host')}/${folder}/${file.filename}`;
            fileUrls.push(fileUrl);
        });

        return res.json({
            status: true,
            message: 'OK',
            error: null,
            data: { file_urls: fileUrls }
        });
    },



    createImage: async (req, res, next) => {
        try {
            let { judul, deskripsi } = req.body;
            let strFile = req.file.buffer.toString('base64');

            let { url } = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: strFile
            });

            let createGambar = await prisma.image.create({
                data: {
                    judul: judul,
                    deskripsi: deskripsi,
                    url_gambar: url
                }
            });

            return res.status(201).json({
                status: true,
                message: 'OK',
                data: createGambar
            });
        } catch (err) {
            next(err);
        }
    },

    getAllImage: async (req, res, next) => {
        try {
            const image = await prisma.image.findMany();
            return res.status(200).json({
                status: true,
                message: 'OK',
                error: null,
                data: image
            });
        } catch (error) {
            next(error);
        }
    },

    getDetailImage: async (req, res, next) => {
        try {
            const { id } = req.params;
            const image = await prisma.image.findUnique({
                where: { id: Number(id) }
            });
            return res.status(200).json({
                status: true,
                message: 'OK',
                error: null,
                data: image
            });
        } catch (error) {
            next(error);
        }
    },

    deleteImage: async (req, res, next) => {
        try {
            const { id } = req.params;
            const image = await prisma.image.delete({
                where: { id: Number(id) }
            });
            return res.status(200).json({
                status: true,
                message: 'OK',
                error: null,
                data: image
            });
        } catch (error) {
            next(error);
        }
    },

    updateImage: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { judul, deskripsi } = req.body;
            const image = await prisma.image.update({
                where: { id: Number(id) },
                data: {
                    judul,
                    deskripsi
                }
            });
            return res.status(200).json({
                status: true,
                message: 'OK',
                error: null,
                data: image
            });
        } catch (error) {
            next(error);
        }
    },

};