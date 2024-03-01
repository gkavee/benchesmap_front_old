import config from '../../config.js'
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@material-ui/core';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles((theme) => ({
  button: {
    width: '40px',
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    backgroundColor: '#385A0E',
    color: '#FFF3DA',
    zIndex: 2,
    '&:hover': {
      backgroundColor: '#243B09',
      color: '#e6dac3',
    },
  },
}));

const CreateBenchModal = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [createdSuccessfully, setCreatedSuccessfully] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hint, setHint] = useState('');
  const [bench, setBench] = useState({
    name: '',
    description: '',
    count: 0,
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const fetchLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        setBench((prevBench) => ({
          ...prevBench,
          latitude: lat,
          longitude: long,
        }));
      });
    };

    fetchLocation();
  }, []);

  const handleSubmit = async () => {
    if (!bench.name) {
      setErrorMessage('Имя лавочки не может быть пустым');
      setSuccessMessage('');
      setErrorOccurred(true);
      return;
    }

    const url = `${config.apiUrl}/bench/create`;
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(bench),
          credentials: 'include',
        });
      
        if (response.status === 200) {
          setSuccessMessage('Лавочка создана успешно');
          setErrorMessage('');
          setCreatedSuccessfully(true);
          setErrorOccurred(false);
        } else {
          setSuccessMessage('');
          setErrorMessage('Произошла ошибка при создании лавочки');
          setErrorOccurred(true);
        }
      } catch (error) {
        console.error('Error creating bench:', error);
        setErrorMessage('Произошла ошибка при создании лавочки');
        setSuccessMessage('');
        setErrorOccurred(true);
      }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBench((prevBench) => ({
      ...prevBench,
      [name]: value,
    }));
  };

  const handleIncrement = () => {
    setHint('');
    setCount((prevCount) => {
      if (prevCount === 0) {
        setHint('');
      }
      return prevCount + 1;
    });
  };

  const handleDecrement = () => {
    setHint('');
    setCount((prevCount) => {
      if (prevCount === 1) {
        setHint('Много лавочек');
      }
      return prevCount > 0 ? prevCount - 1 : 0;
    });
  };

  const handleCountChange = (e) => {
    const newValue = Number(e.target.value);
    setCount(newValue);
    setHint(newValue === 0 ? 'Много лавочек' : '');
  };

  const handleModalClose = () => {
    setOpen(false);
    if (createdSuccessfully || errorOccurred) {
      setCreatedSuccessfully(false);
      setErrorOccurred(false);
      setSuccessMessage('');
      setErrorMessage('');
      setBench({
        name: '',
        description: '',
        count: 1,
        latitude: 0,
        longitude: 0,
      });
    }
  };

  return ReactDOM.createPortal(
    <div>
      <Button variant="contained" className={classes.button} onClick={() => setOpen(true)}>
        <AddIcon />
        <EventSeatIcon />
      </Button>
      <Dialog open={open} onClose={handleModalClose}>
        <DialogTitle>Создать новую лавочку</DialogTitle>
          <DialogContent>
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
            {errorOccurred && <div style={{ color: 'red' }}>{errorMessage}</div>}
            {!createdSuccessfully && !errorOccurred && (
            <>
              <TextField
                margin="dense"
                name="name"
                label="Название"
                type="text"
                fullWidth
                value={bench.name}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="description"
                label="Описание"
                type="text"
                fullWidth
                value={bench.description}
                onChange={handleInputChange}
              />
              <div>
                <TextField
                  margin="dense"
                  name="count"
                  label="Количество"
                  type="number"
                  value={count}
                  fullWidth
                  onInput={handleCountChange}
                  inputProps={{ min: 0 }}
                />
                <IconButton color="primary" onClick={handleIncrement}>
                  <AddIcon />
                </IconButton>
                <IconButton color="primary" onClick={handleDecrement} disabled={count === 0}>
                  <RemoveIcon />
                </IconButton>
                {hint && <span style={{ color: 'red' }}>{hint}</span>}
              </div> 
            </>
            )}
          </DialogContent>
        <DialogActions>
          {createdSuccessfully || errorOccurred ? (
            <Button onClick={handleModalClose} color="primary">
              Закрыть
            </Button>
          ) : (
            <Button onClick={handleModalClose} color="primary">
              Отмена
            </Button>
          )}
          {!createdSuccessfully && !errorOccurred && (
            <Button onClick={handleSubmit} color="primary">
              Создать
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>,
    document.body
    );
};

export default CreateBenchModal;
