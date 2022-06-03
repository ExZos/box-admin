import {useEffect, useState} from 'react';
import {Menu, Table, TableBody, TableRow,
  TableCell, TextField, Button} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import '../assets/styles/jumpToMenu.css';
import {getCursorPos} from '../utils/helper.utils';

function JumpToMenu(props) {
  const anchor = props.anchor;
  const setAnchor = props.setAnchor;
  const page = props.page;
  const setPage = props.setPage;
  const pageCount = props.pageCount;
  const setURLParams = props.setURLParams;

  const [newPage, setNewPage] = useState(1);

  useEffect(() => {
    setNewPage(page);
  }, [anchor, page]);

  return (
    <Menu id="jumpToMenu-container"
      open={Boolean(anchor)} anchorReference="anchorPosition"
      anchorPosition={getCursorPos(anchor)} onClose={() => setAnchor(null)}>
      <Table className="jumpToMenu-table" size="small">
        <TableBody>
          <TableRow>
            <TableCell align="right">
              Jump to
            </TableCell>

            <TableCell>
              <TextField className="jumpToMenu-textfield" fullWidth
                size="small" type="number" value={newPage}
                InputProps={{inputProps:
                  { min: 1, max: pageCount }
                }}
                onChange={(e) => setNewPage(e.currentTarget.value)} />
            </TableCell>

            <TableCell align="center">
              <Button size="small" variant="contained"
                onClick={() => {
                  let val = parseInt(newPage);

                  if(!val || val < 1) val = 1;
                  else if(val > pageCount) val = pageCount;

                  if(page === val) setNewPage(val);
                  setPage(val);
                  setAnchor(null);
                  setURLParams({page: val});
                }}>
                <ArrowForwardIosIcon />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Menu>
  );
}

export default JumpToMenu;
