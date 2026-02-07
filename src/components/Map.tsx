import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, type JSX } from "react"

// Basic marker icon fix for Leaflet + Vite
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconSize: [25, 41],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = defaultIcon

type HotelProps = {
  name: string
  coords: [number, number] // [lat, lng]
  stars?: number
  quality?: number
}

type Coords = {
  name: string | null
  coords: [number, number] // [lat, lng]
}

const STOPS: Coords[] = []

export default function TripMap(props: {
  hotels?: HotelProps[]
  stops?: Coords[]
  mapConfig?: any
}): JSX.Element {
  // Avoid SSR warnings
  useEffect(() => {}, [])
  const { hotels = [], stops = STOPS, mapConfig = {} } = props

  // Use supplied stops (from config) if provided, otherwise fallback to the
  // internal STOPS constant.
  const path = stops.map((s) => s.coords)

  const center = mapConfig.center || [41.9028, 12.4964] // Roma coordinates as fallback
  const zoom = mapConfig.zoom || 4
  const pathColor = mapConfig.pathColor || "#ef4444"
  const pathWeight = mapConfig.pathWeight || 3

  return (
    <div className="w-full h-[420px] rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

        <Polyline positions={path} color={pathColor} weight={pathWeight} />
        {stops
          .filter((s) => s.name !== null)
          .map((s, idx) => (
            <Marker key={idx} position={s.coords} icon={defaultIcon}>
              <Popup>{s.name}</Popup>
            </Marker>
          ))}
        {hotels.map((hotel, idx) => {
          // Prefer `quality` (new name) but keep `stars` as a fallback.
          const stars = hotel.quality ?? hotel.stars ?? 1
          const iconHtml = `
							<div style="
								display:inline-flex;
								align-items:center;
								gap:6px;
								padding:6px 10px;
								background:#ef4444;
								color:#fff;
								font-weight:700;
								border-radius:20px;
								box-shadow:0 1px 4px rgba(0,0,0,0.3);
								font-size:14px;
								">
								<span>${stars}</span>
								<span style="font-size:14px;line-height:1;">★</span>
							</div>
						`
          const icon = L.divIcon({
            html: iconHtml,
            className: "",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          })
          return (
            <Marker key={idx} position={hotel.coords} icon={icon}>
              <Popup>
                <strong>{hotel.name}</strong>
                {stars ? ` — ${stars} ★` : ""}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
