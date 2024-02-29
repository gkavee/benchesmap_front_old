import React, { useEffect, useState } from 'react';
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
  const [loading, setLoading ]= useState(true);
  const [initialPosition, setInitialPosition] = useState(null);

  useEffect(() => {
    const limit = 10;
    const offset = 0;

    fetch(`http://127.0.0.1:8000/benches?limit=${limit}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        setBenches(data.data);
        setLoading(false);
      })
      .catch(error => console.log(error));

    navigator.geolocation.getCurrentPosition((position) => {
      setInitialPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

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
    <MapContainer center={initialPosition} zoom={18} className={classes.map}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={false}
      />
      {benches.map((bench, index) => (
        <Marker key={index} position={[bench.Bench.latitude, bench.Bench.longitude]}>
          <Popup>
            <BenchCard name={bench.Bench.name} latitude={bench.Bench.latitude} longitude={bench.Bench.longitude} description={bench.Bench.description} count={bench.Bench.count}/>
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