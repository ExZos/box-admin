import {useEffect, useState, useMemo, Fragment} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import {Grid, CircularProgress, Card, CardActionArea, CardHeader, Snackbar,
  Alert, TextField, InputAdornment, Badge, Pagination} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import '../assets/styles/boxList.css';
import {server, api} from '../endpoints/server';
import {getNumbValue, getEnumValue, setCursorPos} from '../utils/helper.utils';
import BoxSummary from './BoxSummary';
import AddBox from './AddBox';
import EditBox from './EditBox';
import DeleteBox from './DeleteBox';
import SearchBoxSettings from './SearchBoxSettings';
import SearchMenu from './SearchMenu';
import BoxMenu from './BoxMenu';
import JumpToMenu from './JumpToMenu';

function BoxList() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(location.search);

  const [boxes, setBoxes] = useState([]);
  const [activeBox, setActiveBox] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [searchMenuAnchor, setSearchMenuAnchor] = useState(null);
  const [boxMenuAnchor, setBoxMenuAnchor] = useState(null);
  const [jumpToMenuAnchor, setJumpToMenuAnchor] = useState(null);

  // Pagination
  const [boxesCount, setBoxesCount] = useState(null);
  const [pageSize, setPageSize] = useState(() => getNumbValue(searchParams.get('pageSize'), 2, 1, 1000));
  const [page, setPage] = useState(() => getNumbValue(searchParams.get('page'), 1, 1)); // TODO: get max value
  const pageCount = useMemo(() => Math.ceil(boxesCount / pageSize), [boxesCount, pageSize]);

  // Search
  const [searchVal, setSearchVal] = useState(searchParams.get('search') ? searchParams.get('search') : '');
  const [filterBy, setFilterBy] = useState(searchParams.get('filterBy') ?
      searchParams.get('filterBy').split(',').reduce((dict, el) =>
        ((dict[el] = true, dict)), {}) : {name: true, type: false});
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') ? searchParams.get('sortBy') : 'name');
  const [sortOrder, setSortOrder] = useState(getEnumValue(searchParams.get('sortOrder'), '1', ['1', '-1']));

  // Request
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState(null);

  useEffect(() => {
    const getBoxes = async () => {
      try {
        const queryParams = new URLSearchParams();

        if(filterBy.name) queryParams.append('name', searchVal);
        if(filterBy.type) queryParams.append('type', searchVal);

        queryParams.append('sortBy', sortBy);
        queryParams.append('sortOrder', sortOrder);

        queryParams.append('pageSize', pageSize);
        queryParams.append('page', page);

        const config = {
          params: queryParams
        };

        const res = await server.get(api.box.list, config);
        setBoxes(res.data.boxes);
        setBoxesCount(res.data.count);
        console.log('getBoxes: ', res.data);
      } catch(err) {
        console.error(err);
      }
    };

    getBoxes();
  }, [sendingRequest, searchVal, filterBy, sortBy, sortOrder, pageSize, page]);

  useEffect(() => {
    if(searchVal && (!filterBy.name && !filterBy.type))
      showRequestFeedback('warning', 'No search filters are applied');
  }, [searchVal, filterBy]);

  const onMenuItemClick = (drawerNumb, setMenuAnchor) => {
    setOpenDrawer(drawerNumb);
    setMenuAnchor(null);
  };

  const showRequestFeedback = (status, message, itemName) => {
    setRequestFeedback({
      status: status,
      message:
        <Fragment>
          <span className="reqFeedback-message">{message}</span>
          <span className="reqFeedback-name">{itemName}</span>
        </Fragment>,
      show: true
    });
  };

  const hideRequestFeedback = () => {
    setRequestFeedback({
      ...requestFeedback,
      show: false
    });
  };

  const setURLParams = (params) => {
    for(const [k, v] of Object.entries(params)) {
      if(v) searchParams.set(k, v);
      else searchParams.delete(k);
    }

    setSearchParams(searchParams);
  };

  const renderBoxes = () => {
    if(!boxes || sendingRequest) return <Grid item><CircularProgress /></Grid>;

    if(boxesCount === 0) {
      return (
        <Fragment>
          <Grid item>
            <SearchOffIcon fontSize="large" />
          </Grid>

          <Grid item onClick={() => {
            setSearchVal('');
            setSearchParams({});
          }}>
            Clear
          </Grid>

          <Grid item onClick={() => setOpenDrawer(2)}>
            Add
          </Grid>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <Grid id="boxList-container" container item direction="row" spacing={3} justifyContent="center" alignItems="center">
          {boxes.map((b) =>
            <Grid item key={b._id} onClick={() => {
              setActiveBox(b);
              setOpenDrawer(1);
            }} onContextMenu={(e) => {
              setActiveBox(b);
              setCursorPos(e, setBoxMenuAnchor);
              e.preventDefault();
            }}>
              <Card>
                <CardActionArea>
                  <CardHeader title={b.name} subheader={b.type}
                    className="boxHeader" />
                </CardActionArea>
              </Card>
            </Grid>
          )}
        </Grid>

        <Grid item>
          <Pagination count={pageCount}
            page={page} onChange={(e, page) => {
              setPage(page);
              setURLParams({page: page});
            }}
            boundaryCount={3} onContextMenu={(e) => {
              setCursorPos(e, setJumpToMenuAnchor);
              e.preventDefault();
            }} />
        </Grid>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Grid id="app-container" container direction="column" spacing={5} justifyContent="center" alignItems="center">
        <Grid item id="boxSearch-container">
          <TextField id="boxSearch" className="boxSearch-textfield"
            size="small" value={searchVal} onChange={(e) => {
              setSearchVal(e.target.value);
              setPage(1);
              setURLParams({
                search: e.target.value,
                page: 1
              });
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment className="boxSearch-startAdornment" position="start">
                  <MenuIcon onClick={(e) => setSearchMenuAnchor(e.currentTarget)} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end"
                  onClick={() => document.getElementById('boxSearch').focus()}>
                  <Badge badgeContent={boxesCount} color="primary" showZero>
                    <SearchIcon  />
                  </Badge>
                </InputAdornment>
              )
            }} />
        </Grid>

        <Grid container item direction="column" spacing={5} justifyContent="center" alignItems="center">
          {renderBoxes()}
        </Grid>
      </Grid>

      <Snackbar open={requestFeedback?.show}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert variant="filled" severity={requestFeedback?.status}
          onClose={hideRequestFeedback}>
          {requestFeedback?.message}
        </Alert>
      </Snackbar>

      <BoxSummary box={activeBox} open={openDrawer === 1} setOpen={setOpenDrawer}
        loading={sendingRequest}
        editDrawerNum={3} deleteDrawerNum={4} detailsPath={'/details/' + activeBox?._id} />

      <AddBox open={openDrawer === 2} setOpen={setOpenDrawer}
        loading={sendingRequest} setLoading={setSendingRequest}
        showFeedback={showRequestFeedback} />

      <EditBox box={activeBox} open={openDrawer === 3} setOpen={setOpenDrawer}
        loading={sendingRequest} setLoading={setSendingRequest}
        showFeedback={showRequestFeedback} />

      <DeleteBox box={activeBox} open={openDrawer === 4} setOpen={setOpenDrawer}
        loading={sendingRequest} setLoading={setSendingRequest}
        showFeedback={showRequestFeedback}
        setPage={setPage} setURLParams={setURLParams} />

      <SearchBoxSettings open={openDrawer === 5} setOpen={setOpenDrawer}
        filterBy={filterBy} setFilterBy={setFilterBy}
        sortBy={sortBy} setSortBy={setSortBy}
        sortOrder={sortOrder} setSortOrder={setSortOrder}
        pageSize={pageSize} setPageSize={setPageSize}
        defaultPageSize={2} minPageSize={1} maxPageSize={1000}
        page={page} setPage={setPage} pageCount={pageCount}
        setURLParams={setURLParams} />

      <SearchMenu anchor={searchMenuAnchor} setAnchor={setSearchMenuAnchor}
        onMenuItemClick={onMenuItemClick} settingsDrawerNum={5} addDrawerNum={2} />

      <BoxMenu anchor={boxMenuAnchor} setAnchor={setBoxMenuAnchor}
        onMenuItemClick={onMenuItemClick}
        detailsPath={'/details/' + activeBox?._id} editDrawerNum={3} deleteDrawerNum={4} />

      <JumpToMenu anchor={jumpToMenuAnchor} setAnchor={setJumpToMenuAnchor}
        page={page} setPage={setPage} pageCount={pageCount}
        setURLParams={setURLParams} />
    </Fragment>
  );
}

export default BoxList;
