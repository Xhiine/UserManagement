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

var apiCaller = new ApiCaller();
export default class Permissions extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      rows : []
    }
  }

  fetchPermissionsData = () => {
    apiCaller.getDataFromApi('http://localhost:3001/permission', 'GET', this, function(responseJson, component){
      component.setState( {rows : responseJson} );
    });
  }

  deletePermission = (e, row) => {
    apiCaller.removeDataFromApi('http://localhost:3001/permission/' + row.id, 'DELETE', this, function(component){
      component.fetchPermissionsData();
    });
    apiCaller.removeUserPermissions('http://localhost:3001/user', 'GET', row.id, function(component){
      component.fetchPermissionsData();
    });
  }

  doneButtonCallback = (newPermission, editMode) => {
    if(editMode){
      // Edit mode in case of implementation
    }else{
      apiCaller.createDataOnApi('http://localhost:3001/permission/', 'POST', newPermission, this, function(component){
        component.fetchPermissionsData();
        
        if(newPermission.accountsToApplyList !== undefined && newPermission.accountsToApplyList.length > 0){
          newPermission.accountsToApplyList.forEach(function(accId) {
            newPermission.accId = accId;
            apiCaller.addUserPermissions(newPermission, accId);
          });
        }
      });
    }
  }

  componentDidMount() {
    this.fetchPermissionsData();
  }

  render(){
    return (
      <React.Fragment >
        <Title>
          Permisions
          <PopUp buttonText="Create new" icon="add" 
            cancelButtonText="Cancel" doneButtonText="Create" 
            headerText="Create new permission" func="createPermission"
            doneButtonCallback={this.doneButtonCallback}
          />
        </Title>
        <Table size="small" >
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.commentary}</TableCell>
                <TableCell align='right'>
                  <ButtonGroup>
                    <Button variant="contained" color="secondary" onClick={((e) => this.deletePermission(e, row))}>
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