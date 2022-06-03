import {useEffect, useState, useMemo} from 'react';
import {Drawer, Grid, TextField, Button, CircularProgress} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import '../assets/styles/deleteBox.css';
import {server, api} from '../endpoints/server';

function DeleteBox(props) {
  const box = props.box;
  const open = props.open;
  const setOpen = props.setOpen;
  const loading = props.loading;
  const setLoading = props.setLoading;
  const showFeedback = props.showFeedback;
  const setPage = props.setPage;
  const setURLParams = props.setURLParams;

  const [name, setName] = useState('');

  useEffect(() => {
    setName('');
  }, [open]);

  const isValid = useMemo(() => {
    if(name !== box?.name)
      return false;

    return true;
  }, [name, box?.name]);

  const deleteBox = async () => {
    setLoading(true);

    try {
      const res = await server.delete(api.box.delete + '/' + box?._id);
      console.log('deletedBox: ', res.data);
      showFeedback('success', 'Deleted box:', res.data.name);
    } catch(err) {
      console.error(err);
      const feedbackMsg = err.response.data ? err.response.data : box?.name;
      showFeedback('error', 'Error deleting box:', feedbackMsg);
    }

    setLoading(false);
    setOpen(false);
    setPage(1);
    setURLParams({page: 1});
  };

  const renderDeleteButton = () => {
    if(loading) {
      return (
        <Button size="small" variant="contained" disabled>
          <CircularProgress size={24} />
        </Button>
      );
    }

    return (
      <Button size="small" variant="contained" color="success"
        onClick={deleteBox} disabled={!isValid}>
        <CheckIcon />
      </Button>
    );
  };

  return (
    <Drawer open={open} anchor="bottom"
      ModalProps={{ onBackdropClick: () => setOpen(false) }}>
      <Grid id="deleteBox-container" container direction="column" spacing={2} justifyContent="center" alignItems="center">
        <Grid item className="deleteBox-title">
          Delete Box:
          <span className="boxName">{box?.name}</span>
        </Grid>

        <Grid container item direction="row" spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <TextField className="deleteBox-textfield" size="small"
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder={'Enter \'' + box?.name + '\''}
              disabled={loading} />
          </Grid>
        </Grid>

        <Grid item>
          {renderDeleteButton()}
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default DeleteBox;
