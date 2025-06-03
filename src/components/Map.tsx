import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, LayersControl, ScaleControl, ZoomControl} from 'react-leaflet';
import L, { DivOverlay } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ZoomListener from './ZoomListener';
import { useWebSocket } from './WebSocketContext';
import LaneCalque from './LaneCalque';
import { ButtonProps, Card, Checkbox, Container, FormControlLabel, IconButton, styled } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { CSSObject } from '@emotion/react';

// Tableau de positions des feux
const trafficLights: { id: number; position: [number, number]; label: string; }[] = [
  { id: 1, position: [47.2782063, -1.5214026], label: 'Feu 1' },
  { id: 2, position: [47.277, -1.523], label: 'Feu 2' },
  { id: 3, position: [47.279, -1.520], label: 'Feu 3' },
  { id: 4, position: [47.281, -1.518], label: 'Feu 4' },
];

type IconButtonVariant = Exclude<ButtonProps["variant"], "text"> | "outlined-reverse";

const StyledIconButton = styled(IconButton)<{
    variant?: IconButtonVariant;
}>(({ theme, variant, color, disabled }) => {
    const overrides: CSSObject = {};
    overrides.borderRadius = theme.spacing(1);

    const colorAsVariant =
        color === undefined || color === "inherit" || color === "default"
            ? "primary"
            : color;
    if (variant === "contained") {
        if (disabled) {
            overrides["&:disabled"] = {
                backgroundColor: theme.palette.action.disabled,
            };
        }
        overrides[":hover"] = {
            backgroundColor: getHoverColorFromHex(
                theme.palette[colorAsVariant].main
            ),
        };
        overrides.backgroundColor = theme.palette[colorAsVariant].main;
        overrides.color = theme.palette[colorAsVariant].contrastText;
    }
    if (variant === "outlined") {
        overrides.outline = `1px solid ${
            disabled
                ? theme.palette.action.disabled
                : theme.palette[colorAsVariant].main
        }`;
        overrides.outlineOffset = "-1px";
        overrides.color = theme.palette[colorAsVariant].main;
    }
    if (variant === "outlined-reverse") {
        overrides.backgroundColor = theme.palette[colorAsVariant].main;
        overrides.outline = `1px solid ${theme.palette[colorAsVariant].contrastText}`;
        overrides.outlineOffset = "-1px";
        overrides.color = theme.palette[colorAsVariant].contrastText;
    }

    return {
        ...overrides,
    };
});

function hexToRgb(hex: any) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(
        shorthandRegex,
        function (m: any, r: any, g: any, b: any) {
            return r + r + g + g + b + b;
        }
    );

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
          }
        : null;
}

function getHoverColorFromHex(hex: any) {
    const rgb = hexToRgb(hex);
    if (rgb) {
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
    }
    return hex;
}

function getSvgIcon(size = 32): L.Icon {
  return L.icon({
    iconUrl: 'traffic_lights.svg',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

function Map() {
  // Pour gérer l'état du marker survolé et cliqué
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [clickedId, setClickedId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(16);

  useEffect(() => {
    console.log(`Zoom level changed to: ${zoomLevel}`);
  }, [zoomLevel]);

  return (
    <MapContainer center={[47.23400547531244, -1.5705466304812643]} zoom={16} style={{ height: '100%', width: '100%' }}>
      <ZoomListener onZoomChange={setZoomLevel} />

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <ZoomControl position="bottomleft" />
      <ScaleControl position="bottomleft" />

      <LayersControl position="bottomright">
        <LayersControl.Overlay name="Routes" checked>
          <LaneCalque zoomLevel={zoomLevel} />
        </LayersControl.Overlay>
      </LayersControl>

      {zoomLevel >= 14 && trafficLights.map(light => {
        let size = 32;
        if (clickedId === light.id) size = 48;
        else if (hoveredId === light.id) size = 40;

        return (
          <Marker
            key={light.id}
            position={light.position}
            icon={getSvgIcon(size)}
            eventHandlers={{
              mouseover: () => setHoveredId(light.id),
              mouseout: () => setHoveredId(null),
              click: () => setClickedId(light.id),
            }}
          />
        );
      })}
    </MapContainer>
  );
}

export default Map;
