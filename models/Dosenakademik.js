const mongoose = require('mongoose');

const dosenakademikSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nip: {
        type: String,
        unique: true,
        required: true
    },
    umur: {
        type: Number,
        reqired: true
    },
    tempatTanggalLahir: {
        type: String,
        required: true
    },
    alamat: {
        type: String,
        required: true
    },
    mahasiswa: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mahasiswa"
        }
    ]

})


const Dosenakademik = mongoose.model("Dosenakademik", dosenakademikSchema);

module.exports = Dosenakademik;