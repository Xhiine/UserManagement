import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CreateAccount from './createAccount'
import CreatePermission from './createPermission'

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLockDone = () => {
    setDone(false);
  };

  const handleUnlockDone = () => {
    setDone(true);
  };

  const possibleIcons = () => {
    let icon;
    switch(props.icon){
      case 'assignment':
        icon = <AssignmentIcon />;
        break;
      default:
        icon = <AddIcon />;
        break;
    }
    return icon;
  }
  
  var selectedChecks = (props !== undefined && props.extraData !== undefined) ? props.extraData.permissionList : [];
  const accountsPermissions = (checkbox) => {
    if(selectedChecks.includes(checkbox.id))
      selectedChecks = selectedChecks.filter(function(item) { return item !== checkbox.id })
    else
      selectedChecks.push(checkbox.id); 
    return selectedChecks;
  }

  const possibleForms = () => {
    let formData;
    switch(props.func){
      case "createAccount":
          formData = <CreateAccount permissionCallback={accountsPermissions} lockDoneButton={handleLockDone} unlockDoneButton={handleUnlockDone} editMode={props.editMode} extraData={props.extraData} />;
        break;
      case "createPermission":
          formData = <CreatePermission permissionCallback={accountsPermissions} lockDoneButton={handleLockDone} unlockDoneButton={handleUnlockDone} editMode={props.editMode} extraData={props.extraData} />;
        break;
      default:
    }
    return formData;
  }

  const doneButtonAction = () => {
    let newData = {};
    if(props.func === "createAccount"){
      newData = {
        id: props !== undefined && props.extraData !== undefined ? props.extraData.id : '',
        name : document.getElementById("new_name").value,
        password : document.getElementById("new_password").value,
        commentary : document.getElementById("new_commentary").value,
        permissionList : selectedChecks
      }
    }
    if(props.func === "createPermission"){
      newData = {
        id: props.id,
        name : document.getElementById("new_name").value,
        commentary : document.getElementById("new_commentary").value,
        accountsToApplyList : selectedChecks
      }
    }    
    props.doneButtonCallback(newData, props.editMode);

    handleClose();
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{float: 'right'}}>
        {props.buttonText}
        {possibleIcons()}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.headerText}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.extraMessageText}
          </DialogContentText>
          {possibleForms()}
        </DialogContent>
        <DialogActions>
          <Button onClick={doneButtonAction} variant="contained" color="primary" disabled={!done && !props.editMode}>
            {props.doneButtonText}
          </Button>
          <Button onClick={handleClose} variant="contained" color="secondary">
            {props.cancelButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}