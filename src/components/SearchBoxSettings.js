import {useEffect, useState} from 'react';
import {Drawer, Grid, Table, TableBody, TableRow, TableCell, FormControlLabel,
  Checkbox, Radio, IconButton, Tooltip, TextField, Button} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import '../assets/styles/searchBoxSettings.css';

function SearchBoxSettings(props) {
  const open = props.open;
  const setOpen = props.setOpen;

  // Filter
  const filterBy = props.filterBy;
  const setFilterBy = props.setFilterBy;

  // Sort
  const sortBy = props.sortBy;
  const setSortBy = props.setSortBy;
  const sortOrder = props.sortOrder;
  const setSortOrder = props.setSortOrder;

  // Page size
  const pageSize = props.pageSize;
  const setPageSize = props.setPageSize;
  const defaultPageSize = props.defaultPageSize;
  const minPageSize = props.minPageSize;
  const maxPageSize = props.maxPageSize;

  // Page
  const page = props.page;
  const setPage = props.setPage;
  const pageCount = props.pageCount;

  const setURLParams = props.setURLParams;

  const [newPageSize, setNewPageSize] = useState(defaultPageSize);
  const [newPage, setNewPage] = useState(1);

  useEffect(() => {
    setNewPageSize(pageSize);
    setNewPage(page);
  }, [open, pageSize, page]);

  const setNumbValue = (value, min, max, callback) => {
    let val = parseInt(value);

    if(!val || val < min) val = min;
    else if(val > max) val = max;

    callback(val);
  };

  const renderSortOrderIcon = (title, sortOrderChange, Icon) => {
    return (
      <Tooltip title={title} describeChild followCursor>
        <IconButton variant="contained" color="primary" size="small"
          onClick={() => {
            setSortOrder(sortOrderChange);
            setURLParams({sortBy: sortBy, sortOrder: sortOrderChange});
          }}>
            <Icon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Drawer open={open} anchor="bottom"
      ModalProps={{ onBackdropClick: () => setOpen(false) }}>
      <Grid id="searchBoxSettings-container" container direction="column" spacing={2} justifyContent="center" alignItems="center">
        <Grid item className="searchBoxSettings-title">
          Search settings
        </Grid>

        <Grid item>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell align="right">
                  Search by
                </TableCell>

                <TableCell>
                  <FormControlLabel label="Name" control={<Checkbox size="small"
                    checked={filterBy.name} onChange={(e) => {
                      setFilterBy({...filterBy, name: e.target.checked});
                      setPage(1);

                      // TODO: refactor
                      const filterByKeys = [];
                      if(e.target.checked) filterByKeys.push('name');
                      if(filterBy.type) filterByKeys.push('type');
                      setURLParams({
                        filterBy: filterByKeys.length === 0 ? null : filterByKeys,
                        page: 1
                      });
                    }} />} />

                  <FormControlLabel label="Type" control={<Checkbox size="small"
                    checked={filterBy.type} onChange={(e) => {
                      setFilterBy({...filterBy, type: e.target.checked});
                      setPage(1);

                      const filterByKeys = [];
                      if(e.target.checked) filterByKeys.push('type');
                      if(filterBy.name) filterByKeys.push('name');
                      setURLParams({
                        filterBy: filterByKeys.length === 0 ? null : filterByKeys,
                        page: 1
                      });
                    }} />} />
                </TableCell>

                <TableCell align="center">
                  <FormControlLabel label="All" control={<Checkbox size="small"
                    checked={Boolean(filterBy.name && filterBy.type)}
                    onChange={(e) => {
                      if(!e.target.checked) {
                        setFilterBy({name: false, type: false});
                        setPage(1);
                        setURLParams({filterBy: null, page: 1});
                      } else {
                        setFilterBy({name: true, type: true});
                        setPage(1);
                        setURLParams({filterBy: ['name', 'type'], page: 1})
                      }
                    }} />} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="right">
                  Sort by
                </TableCell>

                <TableCell>
                  <FormControlLabel label="Name" control={<Radio size="small"
                    checked={sortBy === 'name'} onChange={() => {
                      setSortBy('name');
                      setURLParams({sortBy: 'name', sortOrder: sortOrder});
                    }} />} />

                  <FormControlLabel label="Type" control={<Radio size="small"
                    checked={sortBy === 'type'} onChange={() => {
                      setSortBy('type');
                      setURLParams({sortBy: 'type', sortOrder: sortOrder});
                    }} />} />
                </TableCell>

                <TableCell align="center">
                  {sortOrder === 1 ?
                    renderSortOrderIcon('Ascending', -1, ArrowUpwardIcon)
                    :
                    renderSortOrderIcon('Descending', 1, ArrowDownwardIcon)
                  }
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="right">
                  Page size
                </TableCell>

                <TableCell>
                  <TextField className="searchBoxSettings-textfield" fullWidth
                    size="small" type="number" value={newPageSize}
                    InputProps={{inputProps: { min: minPageSize, max: maxPageSize }}}
                    onChange={(e) => setNewPageSize(e.currentTarget.value)} />
                </TableCell>

                <TableCell align="center">
                  <Button size="small" variant="contained"
                    onClick={() => setNumbValue(newPageSize, minPageSize,
                        maxPageSize, (value) => {
                          setPageSize(value);
                          setPage(1);
                          setURLParams({pageSize: value});
                        })
                    }>
                    <ArrowForwardIosIcon />
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell align="right">
                  Jump to
                </TableCell>

                <TableCell>
                  <TextField className="searchBoxSettings-textfield" fullWidth
                    size="small" type="number" value={newPage}
                    InputProps={{inputProps: { min: 1, max: pageCount }}}
                    onChange={(e) => setNewPage(e.currentTarget.value)} />
                </TableCell>

                <TableCell align="center">
                  <Button size="small" variant="contained"
                    onClick={() => setNumbValue(newPage, 1, pageCount,
                      (value) => {
                        if(page === value) setNewPage(value);
                        setPage(value);
                        setURLParams({page: value});
                      })
                    }>
                    <ArrowForwardIosIcon />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default SearchBoxSettings;
