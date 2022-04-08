import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../header'
import Footer from '../footer'
import styles from './error.module.css'

const ErrorPage = ({ msg }) => {
  const location = useLocation();
  return (
    <div className={styles.template}>
      <Header/>
      <h1>Error Page</h1>
      <h3>{msg}</h3>
      <h3>{location?.state?.msg}</h3>
      <Footer />
    </div>
  );
};
export default ErrorPage;
