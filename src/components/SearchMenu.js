import {Menu, MenuItem, ListItemIcon} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';

import '../assets/styles/searchMenu.css';

function SearchMenu(props) {
  const anchor = props.anchor;
  const setAnchor = props.setAnchor;
  const onMenuItemClick = props.onMenuItemClick;
  const settingsDrawerNum = props.settingsDrawerNum;
  const addDrawerNum = props.addDrawerNum;

  return (
    <Menu open={Boolean(anchor)} anchorEl={anchor}
      onClose={() => setAnchor(null)}>
      <MenuItem onClick={() => onMenuItemClick(settingsDrawerNum, setAnchor)}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        Search settings
      </MenuItem>

      <MenuItem onClick={() => onMenuItemClick(addDrawerNum, setAnchor)}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        Add a box
      </MenuItem>
    </Menu>
  );
}

export default SearchMenu;
