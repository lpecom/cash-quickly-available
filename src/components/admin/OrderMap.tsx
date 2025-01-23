import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface OrderMapProps {
  address: string;
}

export const OrderMap = ({ address }: OrderMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHMwbXd3NWowMGRqMmtvNWV2Z2VxZnlsIn0.qY4WKhXgLlsVh_Lv3cXtTQ';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 14,
      center: [-74.5, 40], // Default coordinates
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'bottom-right'
    );

    // Geocode address and center map
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          map.current?.setCenter([lng, lat]);
          new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map.current!);
        }
      });

    return () => {
      map.current?.remove();
    };
  }, [address]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};