// models/GeoData.js
import {Schema,model} from "mongoose";

const geoDataSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  fileName: {
    type: String,
  },
  fileType: {
    type: String,
    enum: ['geojson', 'kml', 'tiff'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const GeoData=model('GeoData',geoDataSchema)

export default GeoData