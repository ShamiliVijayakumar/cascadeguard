'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Zone } from './page'

export default function LeafletMap({ zones, selected, onSelect }: { zones: Zone[]; selected: string; onSelect: (z: Zone) => void }) {
  return <MapContainer center={[14.59,75.03]} zoom={11} scrollWheelZoom={false} className="leaflet-map"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{zones.map(z => <CircleMarker key={z.name} center={[z.lat,z.lon]} radius={z.name===selected?13:10} pathOptions={{color:z.name===selected?'#55d5d8':z.priority>75?'#ef6b68':z.priority>50?'#f19a55':'#73c99b', fillOpacity:.85}} eventHandlers={{click:()=>onSelect(z)}}><Popup><b>{z.name}</b><br/>Population: {z.population.toLocaleString()}<br/>Flood: {z.flood}% · Landslide: {z.landslide}%<br/>Overall risk: {Math.round((z.flood+z.landslide)/2)}%<br/>Priority: {z.priority}<br/><b>Recommended: water, food, medical kits</b></Popup></CircleMarker>)}</MapContainer>
}
