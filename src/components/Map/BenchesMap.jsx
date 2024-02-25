import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { makeStyles } from '@material-ui/core/styles';
import LocateButton from './LocateButton';
import NearestBenchButton from './NearestBenchButton';
import Grid from '@material-ui/core/Grid';
import BenchCard from '../BenchesList/BenchCard';
import Loading from '../Loading';
import L from 'leaflet';

const useStyles = makeStyles((theme) => ({
  map: {
    height: '98vh',
    width: '100%',
    zIndex: 1,
  },
  grid: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 2,
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
        attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
    </MapContainer>
  ) : null;
};

export default BenchesMap;
