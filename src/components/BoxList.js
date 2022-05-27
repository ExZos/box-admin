import {useEffect, useState, Fragment} from 'react';
import {useLocation, useSearchParams} from 'react-router-dom';
import {Grid, CircularProgress, Card, CardActionArea, CardHeader, Snackbar,
  Alert, TextField, InputAdornment, Badge, Pagination} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import '../assets/styles/boxList.css';
import {server, api} from '../endpoints/server';
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
  const [pageSize, setPageSize] = useState(2);
  const [page, setPage] = useState(1);

  // Search
  const [searchVal, setSearchVal] = useState(searchParams.get('search') ? searchParams.get('search') : '');
  const [filterByName, setFilterByName] = useState(true);
  const [filterByType, setFilterByType] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState(1);

  // Request
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestFeedback, setRequestFeedback] = useState(null);

  useEffect(() => {
    const getBoxes = async () => {
      try {
        const queryParams = new URLSearchParams();

        if(filterByName) queryParams.append('name', searchVal);
        if(filterByType) queryParams.append('type', searchVal);

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
  }, [sendingRequest, searchVal, filterByName,
    filterByType, sortBy, sortOrder, pageSize, page]);

  useEffect(() => {
    if(searchVal && (!filterByName && !filterByType))
      showRequestFeedback('warning', 'No search filters are applied');
  }, [searchVal, filterByName, filterByType]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

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

  const setAnchorToCursor = (e, setAnchor) => {
    setAnchor({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };

  const getAnchorCursorPos = (anchor) => {
    if(!anchor) return;

    return { top: anchor.mouseY, left: anchor.mouseX };
  };

  if(!boxes) {
    return (
      <Grid id="loading-container" container direction="column" justifyContent="center" alignItems="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <Fragment>
      <Grid id="app-container" container direction="column" spacing={5} justifyContent="center" alignItems="center">
        <Grid item id="boxSearch-container">
          <TextField id="boxSearch" className="boxSearch-textfield"
            size="small" value={searchVal} onChange={(e) => {
              setSearchVal(e.target.value);
              if(e.target.value) setSearchParams({search: e.target.value});
              else setSearchParams({});
              setPage(1);
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
          {boxesCount === 0 ?
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
            :
            <Fragment>
              <Grid id="boxList-container" container item direction="row" spacing={3} justifyContent="center" alignItems="center">
                {boxes.map((b) =>
                  <Grid item key={b._id} onClick={() => {
                    setActiveBox(b);
                    setOpenDrawer(1);
                  }} onContextMenu={(e) => {
                    setActiveBox(b);
                    setAnchorToCursor(e, setBoxMenuAnchor);
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
                <Pagination count={Math.ceil(boxesCount / pageSize)}
                  page={page} onChange={(e, page) => setPage(page)}
                  boundaryCount={3} onContextMenu={(e) => {
                    setAnchorToCursor(e, setJumpToMenuAnchor);
                    e.preventDefault();
                  }} />
              </Grid>
            </Fragment>
          }
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
        showFeedback={showRequestFeedback} />

      <SearchBoxSettings open={openDrawer === 5} setOpen={setOpenDrawer}
        filterByName={filterByName} setFilterByName={setFilterByName}
        filterByType={filterByType} setFilterByType={setFilterByType}
        sortBy={sortBy} setSortBy={setSortBy}
        sortOrder={sortOrder} setSortOrder={setSortOrder}
        pageSize={pageSize} setPageSize={setPageSize}
        defaultPageSize={2} minPageSize={1} maxPageSize={1000}
        page={page} setPage={setPage} pageCount={Math.ceil(boxesCount / pageSize)} />

      <SearchMenu anchor={searchMenuAnchor} setAnchor={setSearchMenuAnchor}
        onMenuItemClick={onMenuItemClick} settingsDrawerNum={5} addDrawerNum={2} />

      <BoxMenu anchor={boxMenuAnchor} setAnchor={setBoxMenuAnchor}
        getAnchorCursorPos={getAnchorCursorPos} onMenuItemClick={onMenuItemClick}
        detailsPath={'/details/' + activeBox?._id} editDrawerNum={3} deleteDrawerNum={4} />

      <JumpToMenu anchor={jumpToMenuAnchor} setAnchor={setJumpToMenuAnchor}
        getAnchorCursorPos={getAnchorCursorPos}
        page={page} setPage={setPage} pageCount={Math.ceil(boxesCount / pageSize)} />
    </Fragment>
  );
}

export default BoxList;
