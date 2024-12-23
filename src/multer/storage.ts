import { diskStorage } from 'multer';

export const storage = diskStorage({
  destination: 'uploads',
  filename: (req, file, callback) => {
    file.filename = file.originalname;
    return callback(null, file.filename);
  },
});
