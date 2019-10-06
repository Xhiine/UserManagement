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
var allFieldsDone = {name:'', password:'', commentary:''};
export default function CreateAccountTextFileds(props) { 
  const [values, setValues] = React.useState({
    name: props.extraData !== undefined ? props.extraData.name : '',
    password: props.extraData !== undefined ? props.extraData.password : '',
    commentary: props.extraData !== undefined ? props.extraData.commentary : '',
    permissionList: props.extraData !== undefined ? props.extraData.permissionList : []
  });
  const [permissions, setPermissions] = React.useState([]);

  var cleanDoneData = () => {
    allFieldsDone = {name:'', password:'', commentary:''};
    apiCaller.getDataFromApi('http://localhost:3001/permission', 'GET', this, function(responseJson){
      setPermissions(responseJson);
    });  
    props.lockDoneButton();
  }

  var checkboxCheck = (row) => {
    setValues({name : values.name, password : values.password, commentary : values.commentary, permissionList : props.permissionCallback(row) });
  }
  
  var checkAllFieldWithContent = (e) => {
    if(e.target.id === 'new_name'){
      setValues({name : e.target.value, password : values.password, commentary : values.commentary, permissionList : values.permissionList });
      allFieldsDone.name = e.target.value
    }else if(e.target.id === 'new_password'){
      setValues({name : values.name, password : e.target.value, commentary : values.commentary, permissionList : values.permissionList });
      allFieldsDone.password = e.target.value
    }else if(e.target.id === 'new_commentary'){
      setValues({name : values.name, password : values.password, commentary : e.target.value, permissionList : values.permissionList });
      allFieldsDone.commentary = e.target.value
    }
    
    if(allFieldsDone.name !== '' && allFieldsDone.password !== '' && allFieldsDone.commentary !== '' && e.target.value !== '')
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
          label="Account name"
          type="text"
          value={values.name}
          onChange={checkAllFieldWithContent}
          disabled={props.editMode}
      />
      <TextField
          margin="dense"
          id="new_password"
          label="Password"
          type="password"
          value={values.password}
          style={{float:'right'}}
          onChange={checkAllFieldWithContent}
          disabled={props.editMode}
      />
      <TextField
          margin="dense"
          id="new_commentary"
          label="Comment"
          type="text"
          value={values.commentary}
          onChange={checkAllFieldWithContent}
          disabled={props.editMode}
          multiline={true}
          fullWidth
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
            {permissions.map(row => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row" align="left"> 
                  <Checkbox color="primary" id={row.id.toString()} onChange={((e) => checkboxCheck(row))} checked={values.permissionList.includes(row.id)}/>
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