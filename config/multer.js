import multer from "multer"
import crypto from 'crypto'
import path from "path"

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      crypto.randomBytes(12, function(err, bytes){
        const fn = bytes.toString("hex") + path.extname(file.originalname)
        cb(null, fn)
      })
    }
  })
  export const upload = multer({ storage: storage })