const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const possibleDest = {
      profile: "profiles",
      product: "products",
      documento: "documents",
      comprobanteDomicilio: "documents",
      comprobanteCuenta: "documents",
    };

    const { email } = req.user;

    const destFolder = possibleDest[file.fieldname];

    const path = `${process.cwd()}/src/files/${destFolder}`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    if (!fs.existsSync(`${path}/${email}`)) {
      fs.mkdirSync(`${path}/${email}`);
    }

    cb(null, `${path}/${email}`);
  },
  filename: (req, file, cb) => {
    const type = file.originalname.split(".")[1];

    cb(null, `${file.fieldname}.${type}`);
  },
});

const uploader = multer({ storage });

module.exports = uploader;
