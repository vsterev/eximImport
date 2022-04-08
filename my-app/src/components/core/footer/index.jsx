import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import styles from './footer.module.css';

function Copyright() {
  return (
    <React.Fragment>
      <Typography variant="body2" color="textSecondary">
        {'developed by VS -  Copyright © '}
        <Link color="inherit" href="https://b2b.solvex.bg/">
          {' '}
          solvex.bg{' '}
        </Link>
      </Typography>
    </React.Fragment>
  );
}

export default function StickyFooter() {
  return (
    <footer className={styles.footer}>
      <Container maxWidth="sm">
        <Typography variant="body1">Solvex Booking Importer - SBI {new Date().getFullYear()}</Typography>
        <Copyright />
      </Container>
    </footer>
  );
}
