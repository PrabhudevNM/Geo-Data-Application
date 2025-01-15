// controllers/geodataController.js
import GeoData from "../models/GeoData-model.js";
// import getDataUri from "../../utils/datauri.js";
// import { v2 as cloudinary } from "cloudinar
import path from "path"

const geodataCltr = {};

// Create method for handling file uploads
geodataCltr.create = async (req, res) => {
  try {
    const { body } = req;
    const { file } = req;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Validate file extension
    const fileType = path.extname(file.originalname).toLowerCase().slice(1); // Get file extension without dot
    if (!['geojson', 'kml', 'tiff'].includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only GeoJSON, KML, and TIFF files allowed',
      });
    }

    // Ensure user is authenticated
    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: 'User not authenticated.',
      });
    }

    // Create new GeoData entry
    const geoData = new GeoData({
      ...body,
      userId: req.userId,
      fileName: file.originalname,
      fileType: fileType,
      fileUrl: file.path,  // Save file path after upload
    });

    await geoData.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      geoData,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

geodataCltr.list = async (req, res) => {
  try {
    const geoData = await GeoData.find(); // List geo data for the authenticated user
    res.status(200).json({
      success: true,
      geoData,
    });
  } catch (error) {
    console.error("Error fetching geoData:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get GeoData of a user 
geodataCltr.mygeodata = async (req, res) => {
    try {
        const geoData = await GeoData.find({
            userId: req.userId
        });

        if (!geoData) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        res.json(geoData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update GeoData
geodataCltr.update = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if a new file is uploaded
    let fileUpdate = {};
    if (req.file) {
      const fileType = path.extname(req.file.originalname).toLowerCase().replace('.', '');
      if (!['geojson', 'kml', 'tiff'].includes(fileType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid file type. Only GeoJSON, KML, and TIFF files allowed",
        });
      }

      fileUpdate = {
        fileUrl: req.file.path, // Update file path
        fileName: req.file.originalname, // Update file name
        fileType: fileType, // Update file type
      };
    }

    // Merge the body fields with the file updates
    const updateFields = {
      ...req.body,
      ...fileUpdate,
    };

    // Find the document by ID and userId and update it
    const geoData = await GeoData.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { $set: updateFields },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!geoData) {
      return res.status(404).json({
        success: false,
        message: "GeoData not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "GeoData updated successfully",
      geoData,
    });
  } catch (error) {
    console.error("Error updating geoData:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Toggle visibility
geodataCltr.toggleVisibility = async (req, res) => {
    try {
        const geoData = await GeoData.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!geoData) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        geoData.isVisible = !geoData.isVisible;
        await geoData.save();

        res.json({
            success: true,
            isVisible: geoData.isVisible
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete GeoData
geodataCltr.delete = async (req, res) => {
    try {
        const geoData = await GeoData.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!geoData) {
            return res.status(404).json({
                success: false,
                message: "Data not found"
            });
        }

        // Delete file from Cloudinary
        const publicId = geoData.fileUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`GeoData/${publicId}`, {
            resource_type: 'raw'
        });

        // Delete document
        await geoData.deleteOne();

        res.json({
            success: true,
            message: "Data deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default geodataCltr;