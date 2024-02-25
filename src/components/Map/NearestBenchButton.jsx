import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';

const useStyles = makeStyles((theme) => ({
    button: {
      width: '140px',
      position: 'absolute',
      bottom: theme.spacing(7.5),
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
        fetch(`http://127.0.0.1:8000/nearest_bench/?latitude=${lat}&longitude=${long}`)
          .then(response => response.json())
          .then(data => {
            map.flyTo([data.latitude, data.longitude], map.getZoom(), {
              animate: true,
              duration: 0.4 // установите желаемую продолжительность в секундах
            });
          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    };

    return ReactDOM.createPortal(
      <Button className={classes.button} onClick={handleClick}>Nearest bench</Button>,
      document.body
    );
};

export default NearestBenchButton;
