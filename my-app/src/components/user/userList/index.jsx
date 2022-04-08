import { Button } from '@material-ui/core';
import React, { useEffect, useState, useContext } from 'react';
import userServices from '../../../services/user';
import parseCookie from '../../../utils/parseCookie';
import UserContext from '../../../utils/userContext';
import DeleteIcon from '@material-ui/icons/Delete';
const UserList = ({ listRefresh, setListRefresh }) => {
  const [users, setUsers] = useState([]);
  const token = parseCookie('sbi-token');
  const { user } = useContext(UserContext);
  const initalState = () => {
    userServices
      .getAll(token)
      .then((usrs) => setUsers(usrs))
      .catch(console.log);
  };
  useEffect(() => {
    initalState();
    setListRefresh(false);
  }, [listRefresh, setListRefresh]);
  const changeHandlerIsAdmin = (e, _id) => {
    console.log(e.target.checked);
    userServices
      .adminChange(token, { _id, isAdmin: e.target.checked })
      .then((rs) => {
        console.log(rs);
        initalState();
      })
      .catch((err) => console.log(err));
  };
  const deleteHandler = (e, _id) => {
    e.preventDefault();
    console.log(e, _id);
    if (window.confirm('confirm delete')) {
      userServices
        .delete(token, { _id })
        .then((rs) => {
          console.log(rs);
          // setUsers(usersModified);
          initalState();
        })
        .catch(console.log);
    }
  };
  return (
    <React.Fragment>
      {users && (
        <fieldset>
          <legend>users list:</legend>
          <table>
            <thead>
              <tr>
                <th>email</th>
                <th>name</th>
                <th>admin</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((usr) => {
                return (
                  <tr key={usr.email}>
                    <td>{usr.email}</td>
                    <td>{usr.name}</td>
                    <td>
                      <input
                        type="checkbox"
                        //   value={user.isAdmin}
                        checked={usr.isAdmin}
                        onChange={(e) => changeHandlerIsAdmin(e, usr._id)}
                        disabled={usr.email === user.email || usr.email === 'vasil@solvex.bg'}
                      />
                    </td>
                    <td>
                      <Button
                        variant="outlined"
                        color="secondary"
                        type="submit"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={(e) => deleteHandler(e, usr._id)}
                        disabled={usr.email === user.email || usr.email === 'vasil@solvex.bg'}>
                        delete
                      </Button>
                      {/* <button onClick={(e) => deleteHandler(e, usr._id)} disabled={usr.email === user.email}>
                        delete
                      </button> */}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </fieldset>
      )}
      {/* <div>{JSON.stringify(users)}</div> */}
    </React.Fragment>
  );
};
export default UserList;
