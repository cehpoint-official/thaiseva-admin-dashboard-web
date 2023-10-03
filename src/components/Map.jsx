import { GoogleMap, MarkerF } from "@react-google-maps/api";

// { isMarkerShown }
const Map = () => {
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: 22.31098931170375, // Latitude of your desired center point
    lng: 91.85555425228334, // Longitude of your desired center point
  };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
      {/* Optional: Add markers or other components */}
      <MarkerF position={center}>
        <div>Hi</div>
      </MarkerF>
    </GoogleMap>
  );
};

export default Map;
