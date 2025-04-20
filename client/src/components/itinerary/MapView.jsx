import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapView = ({ destination, activities }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [destination.lon, destination.lat],
        zoom: 12
      });
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Set loaded state when map is ready
      map.current.on('load', () => {
        setLoaded(true);
      });
      
      // Clean up on unmount
      return () => map.current?.remove();
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to load map. Please check your internet connection.');
    }
  }, [destination]);

  // Add markers for activities when map is loaded
  useEffect(() => {
    if (!loaded || !map.current || !activities || activities.length === 0) return;
    
    try {
      // Clear existing markers
      const markers = document.querySelectorAll('.mapboxgl-marker');
      markers.forEach(marker => marker.remove());
      
      // Add destination marker
      new mapboxgl.Marker({ color: '#3B82F6' })
        .setLngLat([destination.lon, destination.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${destination.name}</h3>`))
        .addTo(map.current);
      
      // Add activity markers
      activities.forEach((activity, index) => {
        if (!activity.lat || !activity.lon) return;
        
        // Determine marker color based on activity type
        let color = '#10B981'; // Default green
        if (activity.type === 'meal') color = '#F59E0B'; // Yellow for meals
        
        // Create marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = color;
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.borderRadius = '50%';
        el.style.display = 'flex';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
        el.style.color = 'white';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '12px';
        el.innerHTML = (index + 1).toString();
        
        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([activity.lon, activity.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3 class="font-medium">${activity.name}</h3>
               <p class="text-sm">${activity.description || ''}</p>`
            )
          )
          .addTo(map.current);
      });
      
      // Fit bounds to include all markers
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([destination.lon, destination.lat]);
      
      activities.forEach(activity => {
        if (activity.lat && activity.lon) {
          bounds.extend([activity.lon, activity.lat]);
        }
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    } catch (err) {
      console.error('Error adding markers:', err);
    }
  }, [loaded, activities, destination]);

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="h-full" />
    </div>
  );
};

export default MapView;