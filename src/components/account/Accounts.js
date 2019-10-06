import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../title/Title';
import ApiCaller from '../apiCaller/apiCaller';
import PopUp from '../popUp/genericPopUp';

var shajs = require('sha.js')
var apiCaller = new ApiCaller();
export default class Account extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      rows : []
    }
  }
  
  fetchAccountData = () => {
    apiCaller.getDataFromApi('http://localhost:3001/user', 'GET', this, function(responseJson, component){
      component.setState( {rows : responseJson} );
    });
  }

  deleteUser = (e, row) => {
    apiCaller.removeDataFromApi('http://localhost:3001/user/' + row.id, 'DELETE', this, function(component){
      component.fetchAccountData();
    });
  }

  doneButtonCallback = (newAccount, editMode) => {
    if(editMode){
      apiCaller.updateDataOnApi('http://localhost:3001/user/' + newAccount.id, 'POST', newAccount, this, function(component){
        component.fetchAccountData();
      });
    }else{
      newAccount.password = shajs('sha256').update(newAccount.password.toString()).digest('hex');
      apiCaller.createDataOnApi('http://localhost:3001/user/', 'POST', newAccount, this, function(component){
        component.fetchAccountData();
      });
    }
  }

  componentDidMount() {
    this.fetchAccountData();
  }

  render(){
    return (
      <React.Fragment>
        <Title>
          Accounts
          <PopUp buttonText="Create new" icon="add" 
            cancelButtonText="Cancel" doneButtonText="Create" 
            headerText="Create new account" func="createAccount"
            doneButtonCallback={this.doneButtonCallback}
          />
        </Title> 
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Permissions assigned</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.commentary}</TableCell>
                <TableCell >{row.permissionList.length}</TableCell>
                <TableCell align='right'>
                  <ButtonGroup>
                    <PopUp icon="assignment" 
                      cancelButtonText="Cancel" doneButtonText="Edit" 
                      headerText="Edit new account" func="createAccount"
                      doneButtonCallback={this.doneButtonCallback} editMode={true}
                      extraData={row}
                    />
                    <Button variant="contained" color="secondary" onClick={((e) => this.deleteUser(e, row))}>
                      <DeleteIcon />
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </React.Fragment>
    );
  }
}