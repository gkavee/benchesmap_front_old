import React from 'react';
import { useMap } from 'react-leaflet';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const useStyles = makeStyles((theme) => ({
    button: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      backgroundColor: 'red',
      color: 'white',
      zIndex: 2,
      '&:hover': {
        backgroundColor: 'darkred',
        color: '#ddd',
      },
    },
}));

const LocateButton = () => {
    const classes = useStyles();
    const map = useMap();
  
    const handleClick = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        map.flyTo([position.coords.latitude, position.coords.longitude], map.getZoom(), {
          animate: true,
          duration: 0.7
        });
      });
    };
  
    return ReactDOM.createPortal(
      <IconButton className={classes.button} onClick={handleClick}>
        <MyLocationIcon />
      </IconButton>,
      document.body
    );
  };

export default LocateButton;