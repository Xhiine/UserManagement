import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import ApiCaller from '../apiCaller/apiCaller';
import { Checkbox } from '@material-ui/core';

var apiCaller = new ApiCaller(); 
var allFieldsDone = {name:'', commentary:''};
export default function CreatePermissionTextFileds(props) { 
  const [values, setValues] = React.useState({
    name: props.extraData !== undefined ? props.extraData.name : '',
    commentary: props.extraData !== undefined ? props.extraData.commentary : '',
    accountList: props.extraData !== undefined && props.extraData.accountList !== undefined ? props.extraData.accountList : []
  });
  const [accounts, setAccounts] = React.useState([]);

  var cleanDoneData = () => {
    allFieldsDone = {name:'', password:'', commentary:''};
    apiCaller.getDataFromApi('http://localhost:3001/user', 'GET', this, function(responseJson){
      setAccounts(responseJson);
    });
    props.lockDoneButton();
  }

  var checkboxCheck = (row) => {
    setValues({name : values.name, commentary : values.commentary, accountList : props.permissionCallback(row)});
  }

  var checkAllFieldWithContent = (e) => {
    if(e.target.id === 'new_name'){
      setValues({name : e.target.value, commentary : values.commentary, accountList : values.accountList });
      allFieldsDone.name = e.target.value
    }else if(e.target.id === 'new_commentary'){
      setValues({name : values.name, commentary : e.target.value, accountList : values.accountList });
      allFieldsDone.commentary = e.target.value
    }
    
    if(allFieldsDone.name !== '' && allFieldsDone.commentary !== '' && e.target.value !== '')
      props.unlockDoneButton();
    else
      props.lockDoneButton();
  }

  if(document.getElementById("new_name") === null) cleanDoneData();  

  return (
    <div id="new_data">
      <TextField
          autoFocus
          margin="dense"
          id="new_name"
          label="Permission name"
          type="text"
          value={values.name}
          onChange={checkAllFieldWithContent}
          disabled={props.editMode}
      />
      <TextField
          margin="dense"
          id="new_commentary"
          label="Comment"
          type="text"
          multiline={true}
          fullWidth
          value={values.commentary}
          onChange={checkAllFieldWithContent}
          disabled={props.editMode}
      />
      <h4>Assign permissions</h4>
      <Paper>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell align="right"></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Comment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row" align="left"> 
                  <Checkbox color="primary" id={row.id.toString()} onChange={((e) => checkboxCheck(row))} checked={values.accountList.includes(row.id)}/>
                </TableCell>
                <TableCell component="th" scope="row"> {row.name} </TableCell>
                <TableCell align="left">{row.commentary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}