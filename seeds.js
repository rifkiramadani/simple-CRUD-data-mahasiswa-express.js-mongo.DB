const mongoose = require("mongoose");

const Mahasiswa = require("./models/Mahasiswa")

mongoose.connect('mongodb://127.0.0.1:27017/mahasiswa_db').then((result) => {
    console.log("Connected to mahasiswa_db")
}).catch((err) => {
    console.log(err);
});

const seedMahasiswa = ([
    {
        "name": "Muhammad Rifky Ramadani",
        "npm": "G1F022039",
        "prodi": "Sistem Informasi",
        "umur": 19,
        "tempatTanggalLahir": "07-11-04",
        "alamat": "Jalan Suprapto Talang Rimbo Lama",
        "asalSekolah": "MAN REJANG LEBONG"
    },
    {
        "name": "Dwi Saputra",
        "npm": "G1F022069",
        "prodi": "Sistem Informasi",
        "umur": 20,
        "tempatTanggalLahir": "11-23-04",
        "alamat": "Pasar Kepahiang",
        "asalSekolah": "SMAN 1 KEPAHIANG"
    },
    {
        "name": "Muhammad Salman Alfarizi",
        "npm": "G1F022047",
        "prodi": "Sistem Informasi",
        "umur": 20 ,
        "tempatTanggalLahir": "02-04-04",
        "alamat": "ArgaMakmur",
        "asalSekolah": "SMAN 1 BENGLULU UTARA"
    }
]);

Mahasiswa.insertMany(seedMahasiswa).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});