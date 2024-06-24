const express = require("express");
const app = express();
const port = 3000;
const mongoose = require('mongoose');
//import method override
const methodOverride = require('method-override');
//import session dan session flash(connect-session)
const session = require('express-session');
const flash = require('connect-flash');

//ambil data model mahasiswa
const Mahasiswa = require("./models/Mahasiswa");
const Dosenakademik = require("./models/Dosenakademik");
const User = require("./models/User");

//koneksi ke database
mongoose.connect('mongodb://127.0.0.1:27017/mahasiswa_db').then((result) => {
    console.log("Connected to mahasiswa_db")
}).catch((err) => {
    console.log(err);
});

// DEFINE MIDDLEWARE
//aktifkan libary express
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
//aktifkan folder public agar bisa di akses untuk assets seperti bootstrap js atau css
app.use(express.static("public"));
//aktifkan session dan session flash(connect flash)
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

//buat variable global agar session flash dapat digunakan di semua route atau semua halaman atau juga sebagai semantic variable untuk session nya
app.use((req,res,next) => {
    res.locals.flash_message = req.flash('flash_message');
    next();
})

//middleware untuk mengharuskan login
const auth = (req,res,next) => {
    //jikalau req.session.user_id tidak ada maka kembalikan ke halaamn login
    if(!req.session.user_id) {
        return res.redirect('/login');
    } else {
        //jikalau ada maka jalankan perintah selanjutnya
        next();
    }
}

//middleware untuk guest yang dimana jikalau sudah login tidak dapat kembali ke halaman yang tidak mengharuskan login terkecuali menekan tombol logout
const guest = (req,res,next) => {
    if(req.session.user_id) {
        return res.redirect('/mahasiswas');
    } else {
        next()
    }
}

//error async wrapper
function asyncWrapper(fn) {
    return function(req,res,next) {
        fn(req,res,next).catch(err => next(err))
    }
}

// ROUTE
//ROUTE UNTUK AUTH
app.get('/register', guest, async (req,res) => {
    res.render("auth/register.ejs", {
        title: "Register"
    })
})

app.post('/register', guest, async (req,res) => {
    const {username, password} = req.body;
    const user = new User({
        username,
        password,
    });
    req.session.user_id;
    await user.save();
    req.flash("flash_message", "Berhasil Registrasi, Silahkan Login")
    res.redirect('/login')
})

app.get('/login', guest,  async (req,res) => {
    res.render("auth/login.ejs", {
        title: "Login"
    })
})

app.post('/login', guest, async (req,res) => {
    const {username,password} = req.body;
    const user = await User.findByCredentials(username, password);
    if(user) {
        req.session.user_id = user._id;
        req.flash("flash_message", "Berhasil Login")
        res.redirect('/mahasiswas');
    } else {
        res.redirect('/login')
    }
})

app.post('/logout', auth, (req,res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

// ROUTE UNTUK MAHASISWA
app.get("/", guest, (req,res) => {
    res.send("Hello World!");   
});

// route untuk melihat data table data mahasiswa
app.get('/mahasiswas', auth, async (req,res) => {
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
app.get("/mahasiswas/create", auth, async (req,res) => {
    const dosenakademik = await Dosenakademik.find({});
    res.render("mahasiswa/create.ejs", {
        title: "Tambah Mahasiswa",
        dosenakademik: dosenakademik
    })
})

//route untuk insert data
app.post("/mahasiswas", auth, asyncWrapper(async (req,res) => {
    //untuk menyimpan data mahasiswa sekaligus menambahkan data dosen di dalamnya
    const mahasiswa = new Mahasiswa(req.body);
    const dosen = await Dosenakademik.findById(req.body.dosenakademik);
    dosen.mahasiswa.push(mahasiswa.id);
    await mahasiswa.save();
    await dosen.save();
    req.flash('flash_message', 'Data Berhasil Di Tambah!');
    res.redirect('/mahasiswas')
}));

//route untuk detail mahasiswa
app.get("/mahasiswas/:id", auth, asyncWrapper(async (req,res) => {
    const {id} = req.params
    const mahasiswa = await Mahasiswa.findById(id).populate('dosenakademik');
    res.render("mahasiswa/show.ejs", {
        mahasiswa: mahasiswa,
        title: "Detail Mahasiswa"
    })
}));

//route untuk form ubah mahasiswa atau edit mahasiswa
app.get("/mahasiswas/:id/edit", auth, asyncWrapper(async (req,res) => {
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
app.put("/mahasiswas/:id", auth, asyncWrapper(async (req,res) => {
    const {id} = req.params
    await Mahasiswa.findByIdAndUpdate(id, req.body);
    req.flash('flash_message', 'Data Berhasil Di Ubah');
    res.redirect(`/mahasiswas/${id}`);
}))

//route untuk delete data
app.delete("/mahasiswas/:id", auth, asyncWrapper(async (req,res) => {
    const {id} = req.params;
    await Mahasiswa.findOneAndDelete({_id: {$in: id}});
    req.flash('flash_message', 'Data Berhasil Di Hapus');
    res.redirect("/mahasiswas")
}))

// ROUTE UNTUK DOSEN
//Route untuk show dosen
app.get('/dosenakademik/:id', auth, async (req,res) => {
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