import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Modal from 'react-awesome-modal';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from '../graphql/mutations'
import { listTodos, getInterestedList, getInterestedInfo } from '../graphql/queries'
import {updateInterestedList, createInterestedInfo, updateInterestedInfo} from '../graphql/mutations'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify';
import proxy from '../utils/proxy'
// const request = require('request');

// import getSinglePrice from '../utils/crawling'
// import DeleteIcon from '@material-ui/icons/Delete';
// import FilterListIcon from '@material-ui/icons/FilterList';

const axios = require("axios");
const cheerio = require("cheerio");


function createData(name, price, createdDate, port, purchasePrice, dailyChange, currentProfit, soldDate, soldPrice,
  totalProfit, targetPrice, cutoffPrice, weight, targetProfit, remarks, code) {
  return { name, price, createdDate, port, purchasePrice, dailyChange, currentProfit, soldDate, soldPrice,
    totalProfit, targetPrice, cutoffPrice, weight, targetProfit, remarks, code};
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: '종목' },
  { id: 'price', numeric: true, disablePadding: true, label: '현재가' },
  { id: 'createdDate', numeric: false, disablePadding: true, label: '입력날짜' },
  { id: 'port', numeric: false, disablePadding: true, label: '포트' },
  { id: 'purchasePrice', numeric: true, disablePadding: true, label: '매수가' },
  { id: 'dailyChange', numeric: false, disablePadding: true, label: '당일변동률' },
  { id: 'currentProfit', numeric: false, disablePadding: true, label: '현재수익률' },
  { id: 'soldDate', numeric: false, disablePadding: true, label: '매도날짜' },
  { id: 'soldPrice', numeric: true, disablePadding: true, label: '매도가' },
  { id: 'totalProfit', numeric: false, disablePadding: true, label: '정산수익률' },
  { id: 'targetPrice', numeric: true, disablePadding: true, label: '목표가' },
  { id: 'cutoffPrice', numeric: true, disablePadding: true, label: '손절가' },
  { id: 'weight', numeric: false, disablePadding: true, label: '비중' },
  { id: 'targetProfit', numeric: false, disablePadding: true, label: '목표수익률' },
  { id: 'remarks', numeric: false, disablePadding: true, label: '비고' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classes.tablecell}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

async function getUsername() {
  try{
    const {username} = await Auth.currentAuthenticatedUser();
    console.log(username)
    return username
  } catch (error) {
  //   console.log("failed to get user info")
  }
  
}

async function fetchInterestedInfo(code) {
    
  try {
    const variables = {
      id: code
    };

    const interestedInfoData = await API.graphql(graphqlOperation(getInterestedInfo, variables));
    const interestedInfo = interestedInfoData.data.getInterestedInfo

    // console.log(interestedInfo)
    return interestedInfo
    // setInfo(interestedInfo)
  } catch (err) {
    console.log(err)
  }
}

async function fetchInterestedList() {

  try {
      const id = await getUsername()
      const variables = {
          id: id
      };
      const interestedListData = await API.graphql(graphqlOperation(getInterestedList, variables));
      const interestedList = interestedListData.data.getInterestedList.list;
      
      return interestedList
      
  } catch (err) { console.log('error fetching intersted list:', err) }
}

async function deleteSelected(selected) {

  console.log(selected)

  if (selected.length === 0) {
      console.log("please select something")
      return
  }

  try {
      const interestedList = await fetchInterestedList();
      const id = await getUsername();

      const removedList = interestedList.filter(function(value, index, arr){
          return !selected.includes(value);
      })

      const variables = {
          input: {
              id: id,
              list: removedList
          }
      };
      
      await API.graphql(graphqlOperation(updateInterestedList, variables));
      
  } catch (err) { console.log('error registering:', err) }

  window.location.reload();
}

async function modifyInterestedInfo() {

  const code = document.getElementById("modify_code").value;
  const registerDate = document.getElementById("modify_date").value;
  const port = document.getElementById("modify_port").value;
  const purchasePrice = document.getElementById("modify_price").value;
  const soldDate = document.getElementById("modify_sold_date").value;
  const soldPrice = document.getElementById("modify_sold_price").value;
  const targetPrice = document.getElementById("modify_target_price").value;
  const cutoffPrice = document.getElementById("modify_cutoff_price").value;
  const weight = document.getElementById("modify_weight").value;
  const targetProfit = document.getElementById("modify_target_profit").value;
  const totalProfit = document.getElementById("modify_total_profit").value;
  const remarks = document.getElementById("modify_remarks").value;

  try {
    const variables = {
      input: {
          id: code,
          createdDate: registerDate,
          cutoffPrice: cutoffPrice,
          port: port,
          purchasePrice: purchasePrice,
          remarks: remarks,
          soldDate: soldDate,
          soldPrice: soldPrice,
          targetPrice: targetPrice,
          targetProfit: targetProfit,
          totalProfit: totalProfit,
          weight: weight
      }
    };
      
      await API.graphql(graphqlOperation(updateInterestedInfo, variables));
      
  } catch (err) { console.log('error registering:', err) }

  window.location.reload();
}

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, selected } = props;
  const [visible, setVisible] = React.useState(false);
  const [modifying, setModifying] = React.useState();

  async function _openModal(selected) {
      
      const info = await fetchInterestedInfo(String(selected))
      // console.log("selected: " + selected)
      // console.log("selected: " + info["purchasePrice"])
      console.log("modal info: " + info)
      setModifying(info)
      setVisible(true)
  }

  const _closeModal = () => {
      // state = {
      //   visible : false,
      //   selected : selected
      // }
      setVisible(false)
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected {selected}
          <input type='button' value='삭제' className='btn_header' onClick={() => {deleteSelected(selected)}}/>
          {numSelected === 1 ? (<button className='btn_header' onClick={() => {_openModal(selected)}}>수정</button>) : <></>}
          <div className='acenter'>
          <Modal visible={visible} width="400" height="450" effect="fadeInDown" onClickAway={() => {_closeModal()}}>
            
              <div className='acenter'>
                <input className='btn_close' value='X' type='button' onClick={() => {_closeModal()}} />
              </div>

              <div className='modify_grid'>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>종목코드 </div>
                    
                    <input className='modify_input' defaultValue={String(selected)} id="modify_code"/>
                  </div> 
                  <div className='modify_attribute'>
                    <div className='attribute_label'>입력일자 </div>
                    <input type="text" className='modify_input' defaultValue={modifying ? modifying["createdDate"] : ""} id="modify_date"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>포트 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["port"] : ""} id="modify_port"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>매수가 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["purchasePrice"] : ""} id="modify_price"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>매도일자 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["soldDate"] : ""} id="modify_sold_date"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>매도가 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["soldPrice"] : ""} id="modify_sold_price"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>정산수익률 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["totalProfit"] : ""} id="modify_total_profit"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>목표가 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["targetPrice"] : ""} id="modify_target_price"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>손절가 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["cutoffPrice"] : ""} id="modify_cutoff_price"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>비중 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["weight"] : ""} id="modify_weight"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>목표수익률 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["targetProfit"] : ""} id="modify_target_profit"/>
                  </div>
                  <div className='modify_attribute'>
                    <div className='attribute_label'>비고 </div>
                    <input className='modify_input' defaultValue={modifying ? modifying["remarks"] : ""} id="modify_remarks"/>
                  </div>
                   
              </div>

              <input className='btn_register' value='수정' type='button' onClick={() => modifyInterestedInfo()}/>
               
          </Modal>
          </div>
          {/* <input type='button' value='수정' className='btn_header' onClick={() => {console.log("수정")}}/> */}
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          종목표
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            {/* <DeleteIcon /> */}
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            {/* <FilterListIcon /> */}
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tablecell: {
    fontSize: 12
  }
}));

export default function EnhancedTable(props) {
  // console.log(props.selected)
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('price');
  // const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // const [interested, setInterested] = React.useState();
  const [rows, setRows] = React.useState([]);
  const [renew, setRenew] = React.useState(0)
  const [info, setInfo] = React.useState();

  async function getUsername() {
    try{
      const {username} = await Auth.currentAuthenticatedUser();
      console.log(username)
      return username
    } catch (error) {
    //   console.log("failed to get user info")
    }
    
  }

  async function fetchInterestedInfo(code) {
    
    try {
      const variables = {
        id: code
      };

      const interestedInfoData = await API.graphql(graphqlOperation(getInterestedInfo, variables));
      const interestedInfo = interestedInfoData.data.getInterestedInfo

      // console.log(interestedInfo)
      return interestedInfo
      // setInfo(interestedInfo)
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchInterestedList() {

    console.log('fetchInterestedList started...')

    try {
      const id = await getUsername()
      const variables = {
        id: id
      };
      const interestedListData = await API.graphql(graphqlOperation(getInterestedList, variables));
      const interestedList = interestedListData.data.getInterestedList.list;
      let requestUrl = "https://3.36.49.209:5000/marketeye?";

      interestedList.map((v) => {

        requestUrl += "code=A" + v + "&"

      })


      requestUrl = requestUrl.slice(0, requestUrl.length - 1)
      let stockList = await axios.get(requestUrl);
      stockList = stockList["data"];

      let tempRows = [];

      for(let i = 0; i < stockList.length; i++){
        const data = stockList[i];
        let dailyChange = "";
        // console.log("시가: " + data["시가"])
        if(data["현재가"] > data["시가"]){
          let change = data["현재가"] - data["시가"];
          let changeRate = (change / data["시가"]) * 100;
          changeRate = changeRate.toFixed(2);
          dailyChange = "+" + String(changeRate) + "%";
        }else if(data["현재가"] < data["시가"]){
          let change = data["시가"] - data["현재가"];
          let changeRate = (change / data["시가"]) * 100;
          changeRate = changeRate.toFixed(2);
          dailyChange = "-" + String(changeRate) + "%";
        }else{
          dailyChange = "0.00%"
        }
        
        const code = data["종목코드"].substring(1, data["종목코드"].length)
        const info = await fetchInterestedInfo(code)
        
        if (info !== null){
          let currentProfit = '';
          let totalProfit = '';

          if (info['purchasePrice'] !== null && info['purchasePrice'] !== ''){
            const purchasePrice = parseInt(info["purchasePrice"]);
            currentProfit = (data["현재가"] - purchasePrice) * 100 / purchasePrice;
            currentProfit = currentProfit.toFixed(2);
            currentProfit = (currentProfit > 0) ? "+" + currentProfit : currentProfit;
            currentProfit += "%";

            if (info['soldPrice'] !== '' && info['soldPrice'] !== undefined) {
              // console.log('sold price: ' + info['soldPrice'])
              const soldPrice = parseInt(info['soldPrice']);
              totalProfit = (soldPrice - purchasePrice) * 100 / purchasePrice;
              totalProfit = totalProfit.toFixed(2);
              totalProfit = (totalProfit > 0) ? "+" + totalProfit : totalProfit;
              totalProfit += "%";
            }

          }
          

          tempRows.push(createData(data["종목명"], data["현재가"], info["createdDate"], info["port"], info["purchasePrice"], dailyChange, currentProfit, info['soldDate'], info['soldPrice'],
          totalProfit, info['targetPrice'], info['cutoffPrice'], info['weight'], info['targetProfit'], info['remarks'], code))
          // console.log(info)
        } else{
          tempRows.push(createData(data["종목명"], data["현재가"], '', '', '', dailyChange, '', '', '',
          '', '', '', '', '', '', code))
        }
        
      }

      // const tempRows = stockList.map((data) => {
      //   // console.log("stock code: " + data["종목코드"])
      //   let dailyChange = "";
      //   if(data["현재가"] > data["시가"]){
      //     let change = data["현재가"] - data["시가"];
      //     let changeRate = (change / data["시가"]) * 100;
      //     changeRate = changeRate.toFixed(2);
      //     dailyChange = "+" + String(changeRate) + "%";
      //   }else if(data["현재가"] < data["시가"]){
      //     let change = data["시가"] - data["현재가"];
      //     let changeRate = (change / data["시가"]) * 100;
      //     changeRate = changeRate.toFixed(2);
      //     dailyChange = "-" + String(changeRate) + "%";
      //   }else{
      //     dailyChange = "0.00%"
      //   }

      //   const code = data["종목코드"].substring(1, data["종목코드"].length)
      //   // console.log("stock code: " + code)

        

      //   return createData(data["종목명"], data["현재가"], '?', '?', 0, dailyChange, '?', '?', '?',
      //   '?', 0, 0, '?', '?', '?')

      //   // return createData(data["종목명"], data["현재가"], ((info['createdDate'] != undefined) ? info['createdDate'] : ""), '?', 0, dailyChange, '?', '?', '?',
      //   // '?', 0, 0, '?', '?', '?')
      // })

      setRows(tempRows)

      
    } catch (err) { console.log('error fetching intersted list:', err) }

    console.log('fetchInterestedList ended...')
  }

  useEffect(() => {
    fetchInterestedList()

    // 현재가 변경
    // setInterval(() => fetchInterestedList(), 60000)

  }, [renew])

  // componentDidMount() {
  //   fetchInterestedList()
  // }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      props.setSelected(newSelecteds);
      return;
    }
    props.setSelected([]);
  };

  const handleClick = (event, name) => {

    
    const selectedIndex = props.selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(props.selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(props.selected.slice(1));
    } else if (selectedIndex === props.selected.length - 1) {
      newSelected = newSelected.concat(props.selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        props.selected.slice(0, selectedIndex),
        props.selected.slice(selectedIndex + 1),
      );
    }

    props.setSelected(newSelected);

    // console.log(newSelected)
    // console.log(props)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => props.selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={props.selected.length} selected={props.selected}/>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={props.selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.code);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.code)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.price}</TableCell>
                      <TableCell align="center">{row.createdDate}</TableCell>
                      <TableCell align="center">{row.port}</TableCell>
                      <TableCell align="center">{row.purchasePrice}</TableCell>
                      <TableCell align="center">{row.dailyChange}</TableCell>
                      <TableCell align="center">{row.currentProfit}</TableCell>
                      <TableCell align="center">{row.soldDate}</TableCell>
                      <TableCell align="center">{row.soldPrice}</TableCell>
                      <TableCell align="center">{row.totalProfit}</TableCell>
                      <TableCell align="center">{row.targetPrice}</TableCell>
                      <TableCell align="center">{row.cutoffPrice}</TableCell>
                      <TableCell align="center">{row.weight}</TableCell>
                      <TableCell align="center">{row.targetProfit}</TableCell>
                      <TableCell align="center">{row.remarks}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={15} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5,10,25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}

