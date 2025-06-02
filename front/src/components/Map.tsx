import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction du problème d'icône manquante
//import iconUrl from 'leaflet/dist/images/marker-icon.png';
//import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

//let DefaultIcon = L.icon({
  //iconUrl,
  //shadowUrl: iconShadowUrl,
//});
//L.Marker.prototype.options.icon = DefaultIcon;

const position = [47.2782063 , -1.5214026];

function Map() {
  return (
    <Box sx={{ height: '100%', width: '100% ' }}>

          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={position}>
              <Popup>
                Bonjour depuis Paris !
              </Popup>
            </Marker>
          </MapContainer>
    </Box>
  );
}

export default Map;
