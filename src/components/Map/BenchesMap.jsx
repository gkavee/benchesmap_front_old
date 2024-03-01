import config from '../../config';
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { makeStyles } from '@material-ui/core/styles';
import LocateButton from './LocateButton';
import NearestBenchButton from './NearestBenchButton';
import CreateBenchModal from './CreateBenchModal'
import BenchCard from '../Bench/BenchCard';
import Loading from '../Loading';
import L from 'leaflet';

const useStyles = makeStyles((theme) => ({
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
}));

const BenchesMap = () => {
  const classes = useStyles();
  const [benches, setBenches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialPosition, setInitialPosition] = useState(null);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/benches?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        setBenches(prevBenches => [...prevBenches, ...data.data]);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [limit, offset]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setInitialPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const handleMapMove = () => {
    const map = mapRef.current;
    if (map) {
      const newLimit = 10;
      const bounds = map.getBounds();
      const newOffset = benches.length;

      // Проверка, чтобы избежать запросов при каждом движении
      if (bounds && bounds.contains(initialPosition) && map.getZoom() >= 16) {
        setLimit(newLimit);
        setOffset(newOffset);
      }
    }
  };

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return loading ? (
    <Loading />
  ) : initialPosition ? (
    <MapContainer center={initialPosition} zoom={18} className={classes.map} onMoveend={handleMapMove} ref={mapRef}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={false}
      />
      {benches.map((bench, index) => (
        <Marker key={index} position={[bench.latitude, bench.longitude]}>
          <Popup>
            <BenchCard name={bench.name} latitude={bench.latitude} longitude={bench.longitude} description={bench.description} count={bench.count}/>
          </Popup>
        </Marker>
      ))}
      <Marker position={initialPosition} icon={redIcon}>
        <Popup>
          Вы здесь
        </Popup>
      </Marker>
      <LocateButton />
      <NearestBenchButton />
      <CreateBenchModal />
    </MapContainer>
  ) : null;
};

export default BenchesMap;