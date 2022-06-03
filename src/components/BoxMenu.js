import {useNavigate} from 'react-router-dom';
import {Menu, MenuItem, ListItemIcon} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import '../assets/styles/jumpToMenu.css';
import {getCursorPos} from '../utils/helper.utils';

function BoxMenu(props) {
  const navigate = useNavigate();

  const anchor = props.anchor;
  const setAnchor = props.setAnchor;
  const onMenuItemClick = props.onMenuItemClick;
  const detailsPath = props.detailsPath;
  const editDrawerNum = props.editDrawerNum;
  const deleteDrawerNum = props.deleteDrawerNum;

  return (
    <Menu open={Boolean(anchor)} anchorReference="anchorPosition"
      anchorPosition={getCursorPos(anchor)}
      onClose={() => setAnchor(null)}>
      <MenuItem onClick={() => navigate(detailsPath)}>
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
