import React, { useState } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });

  return null;
}

function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  const handleMapClick = async (lat, lon) => {
    setLocation({ lat, lon });

    const apiKey = "cde606f291908b143a59f533ceff0fdf";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Lỗi lấy dữ liệu thời tiết");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Lỗi khi fetch API thời tiết:", err);
    }
  };

  return (
    <div
      className="
        overflow-hidden flex
        min-h-screen min-w-screen
        items-center justify-center
      "
    >
      <div
        className="
          w-7/12 max-xl:w-8/12 max-lg:w-10/12 max-md:w-11/12 max-sm:w-full max-md:py-10 max-md:px-5 max-sm:py-5 max-sm:px-2 min-w-[600px]
          pt-10 py-20 px-10
          bg-[#1a18183f]
          rounded-xl
          shadow-lg shadow-gray-800
        "
      >
        <h1
          className="
            mb-10
            text-4xl font-bold text-center
          "
        >
          🌤️ Weather Map
        </h1>
        <div
          className="
            flex
          "
        >
          <MapContainer
            center={[16.0471, 108.2062]}
            zoom={6}
            style={{ height: "320px", width: "42%" }}
            className="
              rounded-2xl
            "
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            />
            <LocationMarker onLocationSelect={handleMapClick} />
            {location && <Marker position={[location.lat, location.lon]} />}
          </MapContainer>

          {weather && (
            <div
              className="
                h-full w-1/2
                relative left-4/12 -translate-x-1/2
              "
            >
              <div
                className="
                  max-md:text-xl max-sm:text-lg
                  space-y-4
                  text-blue-100 text-2xl
                "
              >
                <h2
                  className="
                    flex
                    max-md:text-3xl max-md:mb-7 max-sm:text-2xl max-sm:mb-4
                    text-4xl font-bold text-nowrap
                    items-center gap-2
                  "
                >
                  📍 <span>{weather.name || "Không rõ vị trí"}</span>
                </h2>

                <div
                  className="
                    flex
                    items-center gap-3
                  "
                >
                  🌡️{" "}
                  <span
                    className="
                      font-medium
                    "
                  >
                    Nhiệt độ:
                  </span>{" "}
                  {weather.main.temp}°C
                </div>

                <div
                  className="
                    flex
                    items-center gap-3
                  "
                >
                  ☁️{" "}
                  <span
                    className="
                      font-medium
                    "
                  >
                    Trạng thái:
                  </span>{" "}
                  {weather.weather[0].description}
                </div>

                <div
                  className="
                    flex
                    items-center gap-3
                  "
                >
                  💧{" "}
                  <span
                    className="
                      font-medium
                    "
                  >
                    Độ ẩm:
                  </span>{" "}
                  {weather.main.humidity}%
                </div>

                <div
                  className="
                    flex
                    items-center gap-3
                  "
                >
                  🌬️{" "}
                  <span
                    className="
                      font-medium
                    "
                  >
                    Gió:
                  </span>{" "}
                  {weather.wind.speed} m/s
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
