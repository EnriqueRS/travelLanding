import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Basic marker icon fix for Leaflet + Vite
const defaultIcon = new L.Icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	iconSize: [25, 41],
	shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = defaultIcon;

type Stop = {
	name: string;
	coords: [number, number]; // [lat, lng]
};

const STOPS: Stop[] = [
	{ name: "Málaga (AGP)", coords: [36.6749, -4.4991] },
	{ name: "Múnich (MUC)", coords: [48.3538, 11.7861] },
	{ name: "Pekín (PEK)", coords: [40.0799, 116.6031] },
	{ name: "Xi'an", coords: [34.3416, 108.9398] },
	{ name: "Chongqing", coords: [29.5630, 106.5516] },
	{ name: "Shanghái (PVG)", coords: [31.1443, 121.8083] },
	{ name: "Zúrich (ZRH)", coords: [47.4647, 8.5492] },
	{ name: "Málaga (AGP)", coords: [36.6749, -4.4991] }
];

export default function TripMap(): JSX.Element {
	// Avoid SSR warnings
	useEffect(() => {}, []);

	const path = STOPS.map((s) => s.coords);

	return (
		<div className="w-full h-[420px] rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
			<MapContainer
				center={[39.9042, 116.4074]}
				zoom={4}
				scrollWheelZoom={false}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
					url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
					subdomains="abcd"
				/>
				<Polyline positions={path} color="#ef4444" weight={3} />
				{STOPS.map((s, idx) => (
					<Marker key={idx} position={s.coords}>
						<Popup>{s.name}</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}


