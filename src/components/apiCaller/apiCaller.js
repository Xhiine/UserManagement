export default class ApiCaller{

    getDataFromApi = (url, method, component, callback) => {
        fetch(url, {
            method: method,
        })
        .then(response => response.json())
        .then(responseJson => {
            callback(responseJson, component);
        });
    }

    removeDataFromApi = (url, method, component, callback) => {
        fetch(url, {
            method: method,
        })
        .then(r => callback(component))
    }

    createDataOnApi = (url, method, newData, component, callback) => {
        fetch(url, {
            crossDomain:true,
            method: method,
            body: JSON.stringify(newData),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        })
        .then(r => callback(component))
    }

    addUserPermissions = (newData, userId) => {
        this.getDataFromApi('http://localhost:3001/user/' + userId, 'GET', this, function(accountsResponseJson, component){
            component.getDataFromApi('http://localhost:3001/permission/', 'GET', component, function(responseJson, component){
                var permission;
                responseJson.forEach(function(p) {
                    if(p.name === newData.name)
                        permission = p;
                });

                if(!accountsResponseJson[0].permissionList.includes(permission.id))
                    accountsResponseJson[0].permissionList.push(permission.id);
                
                component.updateDataOnApi('http://localhost:3001/user/' + userId, 'POST', accountsResponseJson[0], this, function(component){});
            });
        });
    }

    removeUserPermissions = (url, method, permissionToDelete, callback) => {
        this.getDataFromApi(url, method, this, function(accountsResponseJson, component){
            accountsResponseJson.forEach(function(a) {
                if(a.permissionList.includes(permissionToDelete)) {
                    a.permissionList.splice(a.permissionList.indexOf(permissionToDelete), 1);
                    component.updateDataOnApi('http://localhost:3001/user/' + a.id, 'POST', a, this, function(component){});
                }
            });
        });
    }

    updateDataOnApi = (url, method, newData, component, callback) => {
        fetch(url, {
            crossDomain:true,
            method: method,
            body: JSON.stringify(newData),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        })
        .then(r => callback(component))
    }
}