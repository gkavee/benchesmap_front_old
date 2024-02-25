import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@material-ui/core';
import axios from 'axios';

const CreateBenchModal = () => {
  const [open, setOpen] = useState(false);
  const [bench, setBench] = useState({
    name: '',
    description: '',
    count: 0,
    latitude: 0,
    longitude: 0,
  });

  const handleChange = (e) => {
    setBench({ ...bench, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/bench/create/', bench);

      if (response.status === 200) {
        console.log('Bench created successfully');
      } else {
        console.error('Error creating bench');
      }
    } catch (error) {
      console.error('Error creating bench:', error);
    }

    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={() => setOpen(true)}>
        Создать лавочку
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Создать новую лавочку</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="name" label="Название" type="text" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="description" label="Описание" type="text" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="count" label="Количество" type="number" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="latitude" label="Широта" type="number" fullWidth onChange={handleChange} />
          <TextField margin="dense" name="longitude" label="Долгота" type="number" fullWidth onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateBenchModal;
