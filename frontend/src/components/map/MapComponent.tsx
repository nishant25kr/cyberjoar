import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { IntelligenceRecord } from '../../types';
import { format } from 'date-fns';
import { clsx } from 'clsx';

// Custom colored markers use DivIcon as defined inside the component

interface MapComponentProps {
  records: IntelligenceRecord[];
}

const MapComponent: React.FC<MapComponentProps> = ({ records }) => {
  const center: [number, number] = [34.0522, -118.2437]; // LA default

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'OSINT': return '#3b82f6'; // Blue
      case 'HUMINT': return '#f59e0b'; // Amber
      case 'IMINT': return '#ef4444'; // Red
      default: return '#94a3b8';
    }
  };

  // Helper to create a custom colored icon
  const createCustomIcon = (type: string) => {
    const color = getSourceColor(type);
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px ${color};"></div>`,
      className: 'custom-marker-icon',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  return (
    <div className="h-[calc(100vh-250px)] w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative">
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {records.map((record) => (
          <Marker 
            key={record._id} 
            position={[record.latitude, record.longitude]}
            icon={createCustomIcon(record.sourceType)}
          >
            <Popup className="custom-popup">
              <div className="w-64 p-1">
                {record.imageUrl && (
                  <img 
                    src={record.imageUrl.startsWith('http') ? record.imageUrl : `http://localhost:5001${record.imageUrl}`} 
                    alt={record.title} 
                    className="w-full h-32 object-cover rounded-lg mb-3 border border-white/10"
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <span className={clsx(
                    "text-[10px] font-bold px-2 py-0.5 rounded uppercase border",
                    record.sourceType === 'OSINT' && "bg-osint/10 border-osint text-osint",
                    record.sourceType === 'HUMINT' && "bg-humint/10 border-humint text-humint",
                    record.sourceType === 'IMINT' && "bg-imint/10 border-imint text-imint",
                  )}>
                    {record.sourceType}
                  </span>
                  <span className={clsx(
                    "text-[10px] font-bold px-2 py-0.5 rounded",
                    record.priority === 'Critical' ? "bg-red-500 text-white" : "bg-slate-700 text-slate-300"
                  )}>
                    {record.priority}
                  </span>
                </div>
                <h4 className="font-bold text-white mb-1 leading-tight">{record.title}</h4>
                <p className="text-xs text-slate-400 mb-2 line-clamp-2">{record.description}</p>
                <div className="text-[10px] text-slate-500 font-mono">
                  {format(new Date(record.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 z-[1000] bg-surface/90 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[10px]">
        <h5 className="font-bold text-slate-400 mb-2 uppercase tracking-widest text-[8px]">Source Types</h5>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-osint" /> <span className="text-slate-300">OSINT</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-humint" /> <span className="text-slate-300">HUMINT</span></div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-imint" /> <span className="text-slate-300">IMINT</span></div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
