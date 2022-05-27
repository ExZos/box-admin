import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Grid, CircularProgress} from '@mui/material';

import '../assets/styles/boxDetails.css';
import {server, api} from '../endpoints/server';

function BoxDetails(props) {
  const {id} = useParams();

  const [box, setBox] = useState(null);

  useEffect(() => {
    const getBox = async () => {
      try {
        const res = await server.get(api.box.get + '/' + id);
        setBox(res.data);
        console.log('getBox: ', res.data);
      } catch(err) {
        console.error(err);
      }
    };

    getBox();
  }, [id]);

  if(!box) {
    return (
      <Grid id="loading-container" container direction="column" justifyContent="center" alignItems="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <Grid item>
        {box._id}
      </Grid>

      <Grid item>
        {box.name}
      </Grid>

      <Grid item>
        {box.type}
      </Grid>
    </Grid>
  );
}

export default BoxDetails;
