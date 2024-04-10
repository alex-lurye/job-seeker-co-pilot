import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  keyWord: {
    margin: '0.5rem',
  }
}));

const KeyWords = ({
  list,
  onClick,
  onRemove,
  chipComponent: ChipComponent

}) => {
  const classes = useStyles();

  return (
    <>
      {list.map(({ id, alias, ...props }, index) => (
        <ChipComponent
          color="primary"
          key={id}
          className={classes.keyWord}
          label={alias}
          onClick={() => onClick(list[index])}
          onDelete={() => onRemove(list[index])
        }
          {...props}
        />
      ))}
    </>
  );
};

KeyWords.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      alias: PropTypes.string.isRequired,
    })
  ),
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  chipComponent: PropTypes.elementType,
};

KeyWords.defaultProps = {
  chipComponent: Chip,
};

export default KeyWords;
