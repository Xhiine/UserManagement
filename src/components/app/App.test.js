import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';

import Accounts from '../account/Accounts';
import Permissions from '../permissions/Permissions';
import PopUp from '../popUp/genericPopUp';

const component = renderer.create(<App />);
it('Correct render of account section', () => {
    expect(component.toJSON())
        .toMatchSnapshot();

    expect(component.root.findByType(Accounts).props).toEqual({
      id: 'AccountSection',
    });
});

it('Correct render of permission section', () => {
    expect(component.toJSON())
        .toMatchSnapshot();

    expect(component.root.findByType(Permissions).props).toEqual({
      id: 'PermissionSection',
    });
});