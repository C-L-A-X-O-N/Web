import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export default function ZoomListener({ onZoomChange }: { onZoomChange: (z: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom());
    };

    map.on('zoom', handleZoom);

    // Initial zoom
    onZoomChange(map.getZoom());

    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map, onZoomChange]);

  return null;
}
