import React from 'react';
import PropTypes from 'prop-types';
import MainCard from '../../ui-component/cards/MainCard';

const BaseLayout = ({ title, children }) => {
  return (
    <MainCard title={title}>
      {children}
    </MainCard>
  );
};

BaseLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default BaseLayout;