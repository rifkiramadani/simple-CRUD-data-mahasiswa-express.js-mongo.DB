const express = require("express");
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');

//ambil data model mahasiswa
const Mahasiswa = require("./models/Mahasiswa");
const Dosenakademik = require("./models/Dosenakademik");

//koneksi ke database
mongoose.connect('mongodb://127.0.0.1:27017/mahasiswa_db').then((result) => {
    console.log("Connected to mahasiswa_db")
}).catch((err) => {
    console.log(err);
});

//aktifkan libary express
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

//error async wrapper
function asyncWrapper(fn) {
    return function(req,res,next) {
        fn(req,res,next).catch(err => next(err))
    }
}

// ROUTE

// ROUTE UNTUK MAHASISWA
app.get("/", (req,res) => {
    res.send("Hello World!");   
});

// route untuk melihat data table data mahasiswa
app.get('/mahasiswas', async (req,res) => {
       //find berdasarkan prodi
       const {prodi} = req.query;
       if(prodi) {
           const mahasiswa = await Mahasiswa.find({prodi}).populate('dosenakademik');
           res.render("mahasiswa/index.ejs", {
               mahasiswas: mahasiswa,
               title: "Category Mahasiswa"
           })
       //jikalau salah maka tampilkan semua data saja
       } else {
           const mahasiswa = await Mahasiswa.find({}).populate('dosenakademik');
           res.render("mahasiswa/index.ejs", {
               mahasiswas: mahasiswa,
               title: "List Mahasiswa"
           });
       }
})

// route untuk form tambah mahasiswa atau create mahasiswa
app.get("/mahasiswas/create", async (req,res) => {
    const dosenakademik = await Dosenakademik.find({});
    res.render("mahasiswa/create.ejs", {
        title: "Tambah Mahasiswa",
        dosenakademik: dosenakademik
    })
})

//route untuk insert data
app.post("/mahasiswas", asyncWrapper(async (req,res) => {
    //untuk menyimpan data mahasiswa sekaligus menambahkan data dosen di dalamnya
    const mahasiswa = new Mahasiswa(req.body);
    const dosen = await Dosenakademik.findById(req.body.dosenakademik);
    dosen.mahasiswa.push(mahasiswa.id);
    await mahasiswa.save();
    await dosen.save()
    res.redirect('/mahasiswas')
}));

//route untuk detail mahasiswa
app.get("/mahasiswas/:id", asyncWrapper(async (req,res) => {
    const {id} = req.params
    const mahasiswa = await Mahasiswa.findById(id).populate('dosenakademik');
    res.render("mahasiswa/show.ejs", {
        mahasiswa: mahasiswa,
        title: "Detail Mahasiswa"
    })
}));

//route untuk form ubah mahasiswa atau edit mahasiswa
app.get("/mahasiswas/:id/edit", asyncWrapper(async (req,res) => {
    const {id} = req.params
    const dosenakademik = await Dosenakademik.find({});
    const mahasiswa = await Mahasiswa.findById(id);
    res.render("mahasiswa/edit.ejs", {
        mahasiswa: mahasiswa,
        dosenakademik: dosenakademik,
        title: "Ubah Data Mahasiswa"
    })
}));

//route untuk update data
app.put("/mahasiswas/:id", asyncWrapper(async (req,res) => {
    const {id} = req.params
    await Mahasiswa.findByIdAndUpdate(id, req.body);
    res.redirect(`/mahasiswas/${id}`);
}))

//route untuk delete data
app.delete("/mahasiswas/:id", asyncWrapper(async (req,res) => {
    const {id} = req.params;
    await Mahasiswa.findOneAndDelete({_id: {$in: id}});
    res.redirect("/mahasiswas")
}))

// ROUTE UNTUK DOSEN
//Route untuk show dosen
app.get('/dosenakademik/:id', async (req,res) => {
    const {id} = req.params;
    const dosenakademik = await Dosenakademik.findById(id).populate('mahasiswa');
    res.render('dosenakademik/show.ejs', {
        dosenakademik: dosenakademik,
        title: "Dosen"
    })
})

//untuk default value dan untuk bluprint error
app.use((err,req,res,next) => {
    const {status = 500, message = "Something went wrong"} = err;
    res.status(status).send(`<center>${message}</center>`);
})

app.listen(port, () => {
    console.log(`Localhost Server Running On Port ${port}`);
})