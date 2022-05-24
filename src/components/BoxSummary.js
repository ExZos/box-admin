import {Drawer, Grid, Button} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import '../assets/styles/boxSummary.css';

function BoxSummary(props) {
  const box = props.box;
  const open = props.open;
  const setOpen = props.setOpen;
  const loading = props.loading;

  return (
    <Drawer open={open} anchor="bottom"
      ModalProps={{ onBackdropClick: () => setOpen(false) }}>
      <Grid id="boxSummary-container" container direction="column" spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <span className="boxName">{box?.name}</span>
          <span className="boxType">({box?.type})</span>
        </Grid>

        <Grid container item direction="row" spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <Button size="small" variant="outlined" color="error"
              onClick={() => setOpen(4)} disabled={loading}>
              <DeleteIcon />
            </Button>
          </Grid>

          <Grid item>
            <Button size="small" variant="outlined" color="info"
              onClick={() => setOpen(3)} disabled={loading}>
              <EditIcon />
            </Button>
          </Grid>

          <Grid item>
            <Button size="small" variant="contained" disabled={loading}>
              <OpenInNewIcon />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default BoxSummary;
