import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import BenchCard from './BenchCard';
import Loading from '../Loading';

const BenchesList = () => {
  const [benches, setBenches] = useState();
  const [loading, setLoading ]= useState(true);

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
  }, );

  return (
    <Grid container direction="column" alignItems="center" justigy="center" spacing={2}>
      {loading ? (
        <Loading />
      ) : (
        benches.map(bench => (
          <Grid item key={bench.Bench.id} xs={12} sm={6} md={4} lg={3}>
            <BenchCard
              name={bench.Bench.name}
              latitude={bench.Bench.latitude}
              longitude={bench.Bench.longitude}
              description={bench.Bench.description}
              count={bench.Bench.count}
            />
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default BenchesList;