const multer = require("multer");

const DIR = "./uploads/";
const upload = multer({
  storage: multer.diskStorage({
    destination: (cb) => {
      cb(null, DIR);
    },
    filename: (file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (file, cb) => {
    if (file.mimetype === "avatarFile/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only .png, .jpg, .mp4 and .jpeg format allowed!"));
    }
  },
});

exports.send = (req, res, next) => {
  return upload.single("avatarFile")(req, res, () => {
    console.log("multer called");
    console.log(req.avatarFile);
    next();
  });
};
