const express = require("express");
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');

//ambil data model mahasiswa
const Mahasiswa = require("./models/Mahasiswa")

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

// ROUTE
// route untuk melihat data table data mahasiswa
app.get("/", (req,res) => {
    res.send("Hello World!");   
});

app.get('/mahasiswas', async (req,res) => {
       //find berdasarkan prodi
       const {prodi} = req.query;
       if(prodi) {
           const mahasiswa = await Mahasiswa.find({prodi});
           res.render("index.ejs", {
               mahasiswas: mahasiswa,
               title: "Category"
           })
       //jikalau salah maka tampilkan semua data saja
       } else {
           const mahasiswa = await Mahasiswa.find({});
           res.render("index.ejs", {
               mahasiswas: mahasiswa,
               title: "List"
           });
       }
})

// route untuk form tambah mahasiswa atau create mahasiswa
app.get("/mahasiswas/create", (req,res) => {
    res.render("create.ejs", {
        title: "Tambah"
    })
})

//route untuk insert data
app.post("/mahasiswas", async (req,res) => {
    const mahasiswa = new Mahasiswa(req.body);
    await mahasiswa.save();
    res.redirect("/mahasiswas");
})

//route untuk detail mahasiswa
app.get("/mahasiswas/:id", async (req,res) => {
    const {id} = req.params
    const mahasiswa = await Mahasiswa.findById(id)
    res.render("show.ejs", {
        mahasiswa: mahasiswa,
        title: "Detail"
    })
})

//route untuk form ubah mahasiswa atau edit mahasiswa
app.get("/mahasiswas/:id/edit", async (req,res) => {
    const {id} = req.params
    const mahasiswa = await Mahasiswa.findById(id);
    res.render("edit.ejs", {
        mahasiswa: mahasiswa,
        title: "Ubah"
    })
});

//route untuk update data
app.put("/mahasiswas/:id", async (req,res) => {
    const {id} = req.params
    await Mahasiswa.findByIdAndUpdate(id, req.body);
    res.redirect(`/mahasiswas/${id}`);
})

//route untuk delete data
app.delete("/mahasiswas/:id", async (req,res) => {
    const {id} = req.params;
    await Mahasiswa.findByIdAndDelete(id);
    res.redirect("/mahasiswas")
})

app.listen(port, () => {
    console.log(`Localhost Server Running On Port ${port}`);
})