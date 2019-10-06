import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PermissionsIcon from '@material-ui/icons/Lock';
import UsersIcon from '@material-ui/icons/PermIdentity';

class ListItemMenu extends React.Component {
  changeInfo = (element) => {
    document.getElementById("mainMenuList").childNodes[0].childNodes.forEach(e => {
      if(e.className.includes("Mui-selected"))
        e.className = e.className.replace("Mui-selected", "");
    });

    if(this.props.name.includes("Account")){
      document.getElementById("mainMenuList").childNodes[0].childNodes[0].className += " Mui-selected";
      document.getElementById("AccountsContainer").style.display = 'block';
      document.getElementById("PermissionsContainer").style.display = 'none';
    }else if(this.props.name.includes("Permission")){
      document.getElementById("mainMenuList").childNodes[0].childNodes[1].className += " Mui-selected";
      document.getElementById("AccountsContainer").style.display = 'none';
      document.getElementById("PermissionsContainer").style.display = 'block';
    }
  }

  printIcon = () => {
    let icon;

    if(this.props.name === "Accounts")
      icon = <UsersIcon />
    else if(this.props.name === "Permissions")
      icon = <PermissionsIcon />
    
    return icon;
  }

  render(){
    return <ListItem button onClick={this.changeInfo} selected={this.props.isSelected}>
            <ListItemIcon>
              {this.printIcon()}
            </ListItemIcon>
            <ListItemText primary={this.props.name} /> 
          </ListItem>;
  }
}

export const mainListItems = (
  <div>
    <ListItemMenu name="Accounts" isSelected={true}/>
    <ListItemMenu name="Permissions" />
  </div>
);