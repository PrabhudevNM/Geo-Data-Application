<template>
  <div class="map-container">
    <!-- File Upload Section -->
    <div class="upload-section">
      <input 
        type="file" 
        @change="handleFileSelect"
        accept=".geojson,.kml,.tiff"
      >
      <button @click="uploadFile" :disabled="!selectedFile">
        Upload File
      </button>
    </div>

    <!-- Leaflet Map Container -->
    <div id="map" ref="mapContainer" class="map"></div>

    <!-- Layer Controls -->
    <div class="layer-controls">
      <div v-for="layer in layers" :key="layer._id">
        <input 
          type="checkbox" 
          v-model="layer.isVisible"
          @change="toggleLayerVisibility(layer)"
        >
        {{ layer.fileName }}
      </div>
    </div>

    <!-- Map Tools -->
    <div class="map-tools">
      <button @click="toggleDrawing">Draw Shape</button>
      <button @click="toggleMeasure">Measure Distance</button>
      <button @click="toggleMarker">Add Marker</button>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import axiosInstance from '@/config/axios';

// Fix Leaflet's default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: 'MapPage',
  data() {
    return {
      map: null,
      layers: [],
      selectedFile: null,
      layerGroup: null,
      token: localStorage.getItem('token'),
    };
  },
  created() {
    this.api = axiosInstance.create({
      headers: {
        Authorization: this.token,
      },
    });
  },
  mounted() {
    this.initializeMap();
    this.fetchLayers();
  },
  methods: {
    initializeMap() {
      // Ensure the map container is available
      if (!this.$refs.mapContainer) {
        console.error('Map container not found');
        return;
      }

      // Create Leaflet map
      this.map = L.map(this.$refs.mapContainer).setView([51.505, -0.09], 13);

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      // Initialize layer group for uploaded files
      this.layerGroup = L.layerGroup().addTo(this.map);

      // Initialize Leaflet-Geoman controls
      this.map.pm.addControls({
        position: 'topleft',
        drawMarker: true, // We'll handle these through our custom buttons
        drawPolygon: true,
        drawPolyline: true,
        drawCircle: true,
        editMode: true,
        dragMode: true,
        cutPolygon: true,
        removalMode: true,
      });

      // Handle drawing events
      this.map.on('pm:create', (e) => {
        const layer = e.layer;
        this.layerGroup.addLayer(layer);
      });
    },

    async fetchLayers() {
      try {
        const response = await this.api.get('/api/geoData/my-geodata');
        this.layers = response.data;
        this.layers.forEach((layer) => this.addLayerToMap(layer));
      } catch (error) {
        console.error('Error fetching layers:', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        }
      }
    },

    async handleFileSelect(event) {
      this.selectedFile = event.target.files[0];
    },

    async uploadFile() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append('fileUrl', this.selectedFile);

      try {
        const response = await this.api.post('/api/geoData/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const newLayer = response.data;
        this.layers.push(newLayer);
        this.addLayerToMap(newLayer);
      } catch (error) {
        console.error('Upload error:', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        }
      }
    },

    addLayerToMap(layer) {
      if (layer.fileType === 'geojson') {
        this.api
          .get(layer.fileUrl)
          .then((response) => {
            const geoJsonLayer = L.geoJSON(response.data).addTo(this.layerGroup);
            geoJsonLayer.layerId = layer._id;
          })
          .catch((error) => console.error('Error loading layer:', error));
      }
    },

    async toggleLayerVisibility(layer) {
      const mapLayer = this.findLayerById(layer._id);
      if (mapLayer) {
        if (layer.isVisible) {
          this.layerGroup.addLayer(mapLayer);
        } else {
          this.layerGroup.removeLayer(mapLayer);
        }
      }

      try {
        await this.api.patch(`/api/geoData/${layer._id}/toggle`);
      } catch (error) {
        console.error('Error toggling layer visibility:', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        }
      }
    },

    findLayerById(id) {
      let foundLayer = null;
      this.layerGroup.eachLayer((layer) => {
        if (layer.layerId === id) {
          foundLayer = layer;
        }
      });
      return foundLayer;
    },

    toggleDrawing() {
  // Disable any active drawing mode first
  this.map.pm.disableDraw();

  // Enable Polygon drawing mode
  this.map.pm.enableDraw('Polygon', {
    snappable: true,
    templineStyle: {
      color: '#0000ff',
    },
    hintlineStyle: {
      color: '#0000ff',
      dashArray: [5, 5],
    },
  });

  // Listen for polygon creation
  this.map.on('pm:create', (e) => {
    if (e.layer instanceof L.Polygon) {
      const polygon = e.layer;

      // Calculate the perimeter of the polygon
      const latLngs = polygon.getLatLngs()[0]; // Get the coordinates of the polygon
      let perimeter = 0;

      for (let i = 0; i < latLngs.length - 1; i++) {
        perimeter += latLngs[i].distanceTo(latLngs[i + 1]);
      }
      // Close the polygon by adding the distance from the last point to the first point
      perimeter += latLngs[latLngs.length - 1].distanceTo(latLngs[0]);

      // Format the perimeter in meters, kilometers, and miles
      const perimeterInMeters = perimeter.toFixed(2);
      const perimeterInKilometers = (perimeter / 1000).toFixed(2);
      const perimeterInMiles = (perimeter * 0.000621371).toFixed(2);

      // Display the perimeter in a popup
      polygon.bindPopup(`
        Perimeter: <br>
        ${perimeterInMeters} m <br>
        ${perimeterInKilometers} km <br>
        ${perimeterInMiles} miles
      `).openPopup();
    }
  });
},
    toggleMeasure() {
      // Disable any active drawing mode first
      this.map.pm.disableDraw();

      // Enable the Line drawing mode
      this.map.pm.enableDraw('Line', {
        snappable: true,
        templineStyle: {
          color: '#0000ff',
          dashArray: [5, 5],
        },
        hintlineStyle: {
          color: '#0000ff',
          dashArray: [5, 5],
        },
        tooltips: true, // Show tooltips with the distance
      });

      // Listen for the creation of a line to calculate and display the distance
      this.map.on('pm:create', (e) => {
        if (e.layer instanceof L.Polyline) {
          const line = e.layer;
          const latLngs = line.getLatLngs(); // Get the coordinates of the line
          let totalDistance = 0;

          // Calculate the total distance of the line in meters
          for (let i = 0; i < latLngs.length - 1; i++) {
            totalDistance += latLngs[i].distanceTo(latLngs[i + 1]);
          }

          // Format the distance in meters, kilometers, and miles
          const distanceInMeters = totalDistance.toFixed(2);
          const distanceInKilometers = (totalDistance / 1000).toFixed(2);
          const distanceInMiles = (totalDistance * 0.000621371).toFixed(2); // Convert meters to miles

          // Display the distance in a popup
          line.bindPopup(`
            Distance: <br>
            ${distanceInMeters} m <br>
            ${distanceInKilometers} km <br>
            ${distanceInMiles} miles
          `).openPopup();
        }
      });
    },

    toggleMarker() {
      // Disable any active drawing mode first
      this.map.pm.disableDraw();

      // Enable Marker drawing mode
      this.map.pm.enableDraw('Marker', {
        snappable: true,
      });

      // Listen for marker creation
      this.map.on('pm:create', (e) => {
        if (e.layer instanceof L.Marker) {
          const marker = e.layer;

          // Add a click event listener to the marker
          marker.on('click', () => {
            // Get the marker's latitude and longitude
            const latLng = marker.getLatLng();

            // Display details in a popup
            marker.bindPopup(`
              <div class="marker-details">
                <h4>Marker Details</h4>
                <p><strong>Latitude:</strong> ${latLng.lat.toFixed(6)}</p>
                <p><strong>Longitude:</strong> ${latLng.lng.toFixed(6)}</p>
              </div>
            `).openPopup();
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.map-container {
  position: relative;
  height: 100vh;
}

.map {
  width: 100%;
  height: 100%;
}

.layer-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.map-tools {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.upload-section {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>