import multer from 'multer';
import path from 'path';

// Setting up local storage using multer.diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Folder where files will be saved
  },
  filename: (req, file, cb) => {
    // Save file with a timestamp for uniqueness
    cb(null, file.originalname); // This will save the file with its original name
// Adding timestamp for uniqueness
  }
});

// Multer middleware to upload a single file
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // File type validation
    const allowedTypes = ['geojson', 'kml', 'tiff'];
    const fileType = path.extname(file.originalname).toLowerCase().slice(1); // Get file extension without dot

    if (!allowedTypes.includes(fileType)) {
      return cb(new Error('Invalid file type. Only GeoJSON, KML, and TIFF files allowed'), false);
    }
    cb(null, true); // Proceed with upload if valid file type
  }
});

export default upload;
