import React from 'react';
const ErrorPage = ({ msg }) => {
  return (
    <React.Fragment>
      <h2>Error Page</h2>
      <div>{msg}</div>
    </React.Fragment>
  );
};
export default ErrorPage;
