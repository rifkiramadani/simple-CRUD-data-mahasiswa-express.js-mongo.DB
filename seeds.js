const mongoose = require("mongoose");

const Mahasiswa = require("./models/Mahasiswa");
const Dosenakademik = require("./models/Dosenakademik");

mongoose.connect('mongodb://127.0.0.1:27017/mahasiswa_db').then((result) => {
    console.log("Connected to mahasiswa_db")
}).catch((err) => {
    console.log(err);
});

//SEED DOSEN AKADEMIK
const seedDosenakademik = ([
    {
        name: "Hidayat Pahlevi S.kom., M.kom",
        nip: 2201,
        umur: 20,
        tempatTanggalLahir: "2004-12-02",
        alamat: "Talang Benih"
    },
    {
        name: "Thesa Febriani S.kom., M.kom",
        nip: 2202,
        umur: 20,
        tempatTanggalLahir: "2004-11-04",
        alamat: "Padang Guci",
    },
    {
        name: "Benito Jakob Abdillah S.kom., M.kom",
        nip: 2203,
        umur: 21,
        tempatTanggalLahir: "2003-07-07",
        alamat: "Gang 3"
    }
]);

// Dosenakademik.insertMany(seedDosenakademik).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });

//SEED MAHASISWA
// const seedMahasiswa = ([
//     {
//         "name": "Muhammad Rifky Ramadani",
//         "npm": "G1F022039",
//         "prodi": "Sistem Informasi",
//         "umur": 19,
//         "tempatTanggalLahir": "07-11-04",
//         "alamat": "Jalan Suprapto Talang Rimbo Lama",
//         "asalSekolah": "MAN REJANG LEBONG"
//     },
//     {
//         "name": "Dwi Saputra",
//         "npm": "G1F022069",
//         "prodi": "Sistem Informasi",
//         "umur": 20,
//         "tempatTanggalLahir": "11-23-04",
//         "alamat": "Pasar Kepahiang",
//         "asalSekolah": "SMAN 1 KEPAHIANG"
//     },
//     {
//         "name": "Muhammad Salman Alfarizi",
//         "npm": "G1F022047",
//         "prodi": "Sistem Informasi",
//         "umur": 20 ,
//         "tempatTanggalLahir": "02-04-04",
//         "alamat": "ArgaMakmur",
//         "asalSekolah": "SMAN 1 BENGLULU UTARA"
//     }
// ]);

// Mahasiswa.insertMany(seedMahasiswa).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });