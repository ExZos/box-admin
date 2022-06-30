import {useEffect, useState, useMemo} from 'react';
import {Drawer, Grid, TextField, Button, CircularProgress} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import '../assets/styles/editBox.css';
import {server, api} from '../endpoints/server';

function EditBox(props) {
  const box = props.box;
  const open = props.open;
  const setOpen = props.setOpen;
  const loading = props.loading;
  const setLoading = props.setLoading;
  const showFeedback = props.showFeedback;

  const [name, setName] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    setName(box?.name);
    setType(box?.type);
  }, [box]);

  const isValid = useMemo(() => {
    if(!name || !name.trim())
      return false;

    if(!type || !type.trim())
      return false;

    return true;
  }, [name, type]);

  const editBox = async () => {
    setLoading(true);

    if(!isValid)
      return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const editedBox = {
        name: name,
        type: type
      };

      const res = await server.put(api.box.update + '/' + box._id, editedBox, config);
      console.log('editedBox: ', res.data);
      showFeedback('success', 'Edited box:', res.data.name);
    } catch(err) {
      console.error(err);
      const feedbackMsg = err.response.data ? err.response.data : box?.name;
      showFeedback('error', 'Error editing box:', feedbackMsg);
    }

    setLoading(false);
    setOpen(false);
  };

  const renderEditButton = () => {
    if(loading) {
      return (
        <Button size="small" variant="contained" disabled>
          <CircularProgress size={24} />
        </Button>
      );
    }

    return (
      <Button size="small" variant="contained" color="success"
        onClick={editBox} disabled={!isValid}>
        <CheckIcon />
      </Button>
    );
  };

  return (
    <Drawer open={open} anchor="bottom"
      ModalProps={{ onBackdropClick: () => setOpen(false) }}>
      <Grid id="editBox-container" container direction="column" spacing={2} justifyContent="center" alignItems="center">
        <Grid item className="editBox-title">
          Edit Box:
          <span className="boxName">{box?.name}</span>
        </Grid>

        <Grid container item direction="row" spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <TextField className="editBox-textfield" placeholder="name" size="small"
              value={name ? name : ''} onChange={(e) => setName(e.target.value)}
              disabled={loading} />
          </Grid>

          <Grid item>
            <TextField className="editBox-textfield" placeholder="type" size="small"
              value={type ? type : ''} onChange={(e) => setType(e.target.value)}
              disabled={loading} />
          </Grid>

        </Grid>

        <Grid item>
          {renderEditButton()}
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default EditBox;
