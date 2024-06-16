const mongoose = require('mongoose');

const mahasiswaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    npm: {
        type: String,
        required: true,
        unique: true
    },
    prodi: {
        type: String,
        enum: ["Teknik Informatika", "Teknik Sipil", "Teknik Mesin", "Teknik Elektro", "Arsitektur", "Sistem Informasi"]
    },
    umur: {
        type: Number,
        required: true
    },
    tempatTanggalLahir: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    asalSekolah: {
        type: String,
        required: true
    }
});

const Mahasiswa = mongoose.model("Mahasiswa", mahasiswaSchema);

module.exports = Mahasiswa;

