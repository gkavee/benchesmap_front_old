import config from '../../config';
import React from 'react';
import { useMap } from 'react-leaflet';
import { IconButton } from '@material-ui/core';
import NotListedLocationIcon from '@mui/icons-material/NotListedLocation';
import { makeStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';

const useStyles = makeStyles((theme) => ({
    button: {
      position: 'absolute',
      bottom: theme.spacing(8.5),
      right: theme.spacing(2),
      backgroundColor: '#5C4033',
      color: '#F5DEB3',
      zIndex: 2,
      '&:hover': {
        backgroundColor: '#3d2a21',
        color: '#ccb995',
      },
    },
}));

const NearestBenchButton = () => {
    const classes = useStyles();
    const map = useMap();    

    const handleClick = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        fetch(`${config.apiUrl}/nearest_bench/?latitude=${lat}&longitude=${long}`)
          .then(response => response.json())
          .then(data => {
            map.flyTo([data.latitude, data.longitude], map.getZoom(), {
              animate: true,
              duration: 0.7
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    };

    return ReactDOM.createPortal(
      <IconButton className={classes.button} onClick={handleClick}>
        <NotListedLocationIcon />
      </IconButton>,
      document.body
    );
};

export default NearestBenchButton;
