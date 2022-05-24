import {useEffect, useState, useMemo} from 'react';
import {Drawer, Grid, TextField, Button, CircularProgress} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import '../assets/styles/addBox.css';
import {server, api} from '../endpoints/server';

function AddBox(props) {
  const open = props.open;
  const setOpen = props.setOpen;
  const loading = props.loading;
  const setLoading = props.setLoading;
  const showFeedback = props.showFeedback;

  const [name, setName] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    setName('');
    setType('');
  }, [open]);

  const isValid = useMemo(() => {
    if(!name || !name.trim())
      return false;

    if(!type || !type.trim())
      return false;

    return true;
  }, [name, type]);

  const addBox = async () => {
    setLoading(true);

    if(!isValid)
      return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const addedBox = {
        name: name,
        type: type
      };

      const res = await server.post(api.box.create, addedBox, config);
      console.log('addedBox: ', res.data);
      showFeedback('success', 'Added box:', res.data.name);
    } catch(err) {
      console.error(err);
      const feedbackMsg = err.response.data ? err.response.data : name;
      showFeedback('error', 'Error adding box:', feedbackMsg);
    }

    setLoading(false);
    setOpen(false);
  };

  const renderAddButton = () => {
    if(loading) {
      return (
        <Button size="small" variant="contained" disabled>
          <CircularProgress size={24} />
        </Button>
      );
    }

    return (
      <Button size="small" variant="contained" color="success"
        onClick={addBox} disabled={!isValid}>
        <CheckIcon />
      </Button>
    );
  };

  return (
    <Drawer open={open} anchor="bottom"
      ModalProps={{ onBackdropClick: () => setOpen(false) }}>
      <Grid id="addBox-container" container direction="column" spacing={2} justifyContent="center" alignItems="center">
        <Grid item className="addBox-title">
          Add a Box
        </Grid>

        <Grid container item direction="row" spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <TextField className="addBox-textfield" placeholder="name" size="small"
              value={name} onChange={(e) => setName(e.target.value)}
              disabled={loading} />
          </Grid>

          <Grid item>
            <TextField className="addBox-textfield" placeholder="type" size="small"
              value={type} onChange={(e) => setType(e.target.value)}
              disabled={loading} />
          </Grid>

        </Grid>

        <Grid item>
          {renderAddButton()}
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default AddBox;
