import React from 'react';
import { useMap } from 'react-leaflet';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';


const useStyles = makeStyles((theme) => ({
    button: {
      width: '140px',
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
      <Button className={classes.button} onClick={handleClick}>Locate me</Button>,
      document.body
    );
  };

export default LocateButton;