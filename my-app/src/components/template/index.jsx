import React, { useContext } from 'react';
import HeaderComponent from '../core/header';
import FooterComponent from '../core/footer';
import { Helmet } from 'react-helmet';
import styles from './template.module.css';
// import PartnerContext from '../../utils/partnerContext';
import UserContext from '../../utils/userContext';
import PartnerSelectNew from '../shared/partners-select';
import { Link, useLocation } from 'react-router-dom';

const PageTemplate = ({ children, title }) => {
  // const { partner } = useContext(PartnerContext);
  const { user } = useContext(UserContext);
  const location = useLocation();
  return (
    <div className={styles.template}>
      <HeaderComponent />
      <Helmet>
        <title>SBI - {title}</title>
      </Helmet>
      {/* <h2>SBI - Solvex Booking Importer</h2> */}
      <div className={styles.children}>
        <div className={styles.top}>
          {user?.isAdmin && location.pathname !== '/user/edit' && <PartnerSelectNew />}
          <h2 className={styles.title}>{title} </h2>
          {location.pathname !== '/user/edit' && !!user?.email && (
            <section className={styles.mapMenu}>
              <p style={{ FontWeights: 'bold' }}>mapping tables</p>
              <ul>
                <li>
                  <Link to="/map/board">boards</Link>
                </li>
                <li>
                  <Link to="/map/hotel">hotels</Link>
                </li>
                <li>
                  <Link to="/map/transfer-type">transfer-types</Link>
                </li>
              </ul>
            </section>
          )}
        </div>
        {children}
      </div>
      {/* <div>by Vassil Shterev</div> */}
      <FooterComponent />
    </div>
  );
};
export default PageTemplate;
