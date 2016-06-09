import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';

const { string, bool, func } = PropTypes;

const Item = ({ photoUrl, author, isFavorite, onFavoriteButtonClick }) => {
  return (
    <li className="list-item">
      <div className="list-content">
        <img src={photoUrl} alt="" />
        <p>Author: {author}</p>
        <Button bsSize="large" bsStyle={`${isFavorite ? 'danger' : 'default'}`} onClick={onFavoriteButtonClick}>
          <span className="glyphicon glyphicon-heart" aria-hidden="true"></span>
        </Button>
      </div>
    </li>
  );
}

Item.propTypes = {
  photoUrl: string.isRequired,
  author: string.isRequired,
  isFavorite: bool.isRequired,
  onFavoriteButtonClick: func.isRequired
};

export default Item;
