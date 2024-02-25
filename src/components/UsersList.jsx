import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, CircularProgress } from '@material-ui/core';

const UsersList = () => {
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const limit = 10;
    const offset = 0;

    fetch(`http://127.0.0.1:8000/users?limit=${limit}&offset=${offset}`)
      .then(response => response.json())
      .then(data => {
        setUsers(data.data);
        setLoading(false);
      })
      .catch(error => console.log(error));
  }, );

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {users.map(user => (
            <ListItem key={user.User.id}>
              <ListItemText primary={user.User.username} secondary={user.User.email} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default UsersList;