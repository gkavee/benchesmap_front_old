import React from 'react';
import { Card, CardContent, Typography, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    border: '1px solid #3e1c00',
    backgroundColor: 'beige',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  title: {
    color: '#3e1c00',
  },
  decs: {
    color: '#633200',
  },
  coords: {
    color: '#492201',
  },
  link: {
    color: 'red',
    alignSelf: 'flex-end'
  },
});

const BenchCard = ({ name, latitude, longitude, description, count }) => {
  const classes = useStyles();
  const yandexMapsLink = `https://yandex.ru/maps/?rtext=~${latitude},${longitude}&rtt=auto`;

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography variant="h5" component="h2" className={classes.title}>
          {name} {count > 0 && `(x${count})`}
        </Typography>
        <Typography color="textSecondary" className={classes.coords}>
          {latitude}, {longitude}
        </Typography>
        <Typography color="textSecondary" className={classes.decs}>
          {description}
        </Typography>
        <Link href={yandexMapsLink} target="_blank" rel="noopener" className={classes.link}>
          Открыть в Яндекс.Картах
        </Link>
      </CardContent>
    </Card>
  );
};

export default BenchCard;
