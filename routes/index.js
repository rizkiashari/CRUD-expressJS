const express = require('express');
const router = express.Router();
const dbConnection = require("../lib/db");

/* GET home page. */
router.get('/', function(req, res, next) {
  dbConnection.query(`
    SELECT  jk.idKegiatan as id,
            jk.nameKegiatan as name,
            jk.desc_kegiatan as description,
            jk.gambar	as gambar,
            jk.tanggalKegiatan as tgl,
            st.name as name
    FROM kegiatan jk JOIN status st
    ON jk.idStatus  = st.idStatus 
    ORDER BY idKegiatan DESC
  `, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      res.render("schedule/index", {
        data: data,
      })
    }
  })
});

// Add
router.get("/add", (req, res) => {
  dbConnection.query("SELECT * FROM status", (error, data) => {
    const statusUser = data;
    dbConnection.query("SELECT * FROM user", (erorr, data) => {
      const user = data;
      if (error) {
        console.log(error);
      }
      else {
        res.render("schedule/add", {
          user,
          statusUser,
          nameKegiatan: "",
          desc: "",
          statusId: "",
          gambar: "",
          userId: "",
          tgl: "",
        })
      }
    });
  });
});

router.post("/store", (req, res) => {
  let today = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log(today);
  const storeData = {
    nameKegiatan: req.body.nameKegiatan,
    desc: req.body.desc,
    statusId: req.body.statusId,
    gambar: req.body.gambar,
    userId: req.body.userId,
    tgl: today,
  };

  let error = false;

  if (!storeData.nameKegiatan.length || !storeData.desc.length || !storeData.statusId.length || !storeData.gambar.length || !storeData.userId.length || storeData.tgl === null) {
    error = true;
    req.flash("error", "Semua data harus di isi!!");
    res.render("schedule/add", {
      nameKegiatan: storeData.nameKegiatan,
      desc: storeData.desc,
      statusId: storeData.statusId,
      gambar: storeData.gambar,
      userId: storeData.userId,
      tgl: storeData.tgl,
    });
  }
  else {
    const formData = {
      nameKegiatan: storeData.nameKegiatan,
      desc_kegiatan: storeData.desc,
      idStatus: storeData.statusId,
      gambar: storeData.gambar,
      idUser: storeData.statusId,
      tanggalKegiatan: storeData.tgl,
    }
  
    dbConnection.query("INSERT INTO kegiatan SET ?", formData, (error) => {
      if (error) {
        req.flash("error datanya", error)
      } else {
        req.flash("success", "Berhasil Add Schedule");
        res.redirect("../schedule");
      }
    })
  }
});

router.get("/delete/(:idKegiatan)", (req, res) => {
  const id = req.params.idKegiatan;

  dbConnection.query("DELETE FROM kegiatan WHERE idKegiatan = " + id, (error) => {
    if (error) {
      req.flash("error datanya", error)
    } else {
      req.flash("success", "Berhasil Delete Schedule");
      res.redirect("/schedule");
    }
  })
});

router.get("/edit/(:idKegiatan)", (req, res) => {
  const id = req.params.idKegiatan;

  dbConnection.query("SELECT * FROM kegiatan WHERE idKegiatan = " + id, (error, data) => {
    if (error) {
      req.flash("error datanya", error);
    } else {
      // console.log(typeof data[0].tanggalKegiatan);
      res.render("schedule/edit", {
        id: data[0].idKegiatan,
        nameKegiatan: data[0].nameKegiatan,
        desc: data[0].desc_kegiatan,
        statusId: data[0].idStatus,
        gambar: data[0].gambar,
        userId: data[0].idUser,
        tgl: data[0].tanggalKegiatan,
      });
      // console.log(data[0].tanggalKegiatan);
    }
  });
});

router.post("/update", (req, res) => {
  let today = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log(today);
  const updateData = {
    nameKegiatan: req.body.nameKegiatan,
    desc: req.body.desc,
    statusId: req.body.statusId,
    gambar: req.body.gambar,
    userId: req.body.userId,
    tgl: today,
    id: req.body.id,
  };

  let error = false;

  if (!updateData.nameKegiatan.length || !updateData.desc.length || !updateData.statusId.length || !updateData.gambar.length || !updateData.userId.length || updateData.tgl === null) {
    error = true;
    req.flash("error", "Semua data harus di isi!!");
    res.render("schedule/edit", { nameKegiatan, desc, statusId, gambar, userId, tgl });
  }

  if (!error) {
    const formData = {
      nameKegiatan: updateData.nameKegiatan,
      desc_kegiatan: updateData.desc,
      idStatus: updateData.statusId,
      gambar: updateData.gambar,
      idUser: updateData.userId,
      tanggalKegiatan: updateData.tgl,
    }
  
    dbConnection.query("UPDATE kegiatan SET ? WHERE idKegiatan = "+id, formData, (error) => {
      if (error) {
        console.log(id);
        req.flash("error datanya", error)
      } else {
        req.flash("success", "Berhasil Edit Schedule");
        // req.flash("error", "Semua data harus di isi!!");
        res.render("schedule/edit", {
          nameKegiatan: updateData.nameKegiatan, desc: updateData.desc,
          statusId: updateData.statusId,
          gambar: updateData.gambar,
          userId: updateData.userId,
          tgl: updateData.tgl,
        });
        res.redirect("/schedule");
      }
    })
  }
});

module.exports = router;
