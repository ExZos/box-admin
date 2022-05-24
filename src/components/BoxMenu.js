import {Menu, MenuItem, ListItemIcon} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import '../assets/styles/jumpToMenu.css';

function BoxMenu(props) {
  const anchor = props.anchor;
  const setAnchor = props.setAnchor;
  const getAnchorCursorPos = props.getAnchorCursorPos;
  const onMenuItemClick = props.onMenuItemClick;
  const editDrawerNum = props.editDrawerNum;
  const deleteDrawerNum = props.deleteDrawerNum;

  return (
    <Menu open={Boolean(anchor)} anchorReference="anchorPosition"
      anchorPosition={getAnchorCursorPos(anchor)}
      onClose={() => setAnchor(null)}>
      <MenuItem>
        <ListItemIcon>
          <OpenInNewIcon fontSize="small" />
        </ListItemIcon>
        Details
      </MenuItem>

      <MenuItem onClick={() => onMenuItemClick(editDrawerNum, setAnchor)}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        Edit
      </MenuItem>

      <MenuItem onClick={() => onMenuItemClick(deleteDrawerNum, setAnchor)}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="danger" />
        </ListItemIcon>
        Delete
      </MenuItem>
    </Menu>
  );
}

export default BoxMenu;
