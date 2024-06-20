const mongoose = require('mongoose');

const mahasiswa = require("./Mahasiswa");

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

dosenakademikSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await mahasiswa.deleteMany({
            _id: {
                $in: doc.mahasiswa
            }
        })
    }
})

const Dosenakademik = mongoose.model("Dosenakademik", dosenakademikSchema);

module.exports = Dosenakademik;