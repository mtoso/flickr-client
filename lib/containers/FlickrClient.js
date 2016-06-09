import React, { PropTypes } from 'react';
import unionBy from 'lodash.unionby';
import find from 'lodash.find';
import indexOf from 'lodash.indexof';
import fetchJsonp from 'fetch-jsonp';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Item from '../components/Item';

const { string, number } = PropTypes;
const SHOW_ALL_FILTER = 'all';
const SHOW_FAVORITE_FILTER = 'favorite';

function extractAuthorNikname(str) {
  return str.substring(str.lastIndexOf('(') + 1, str.lastIndexOf(')'));
}

function mapFeedResponse(feedData) {
  return feedData.items.map((item) => {
    return {
      author: extractAuthorNikname(item.author),
      photoUrl: item.media.m,
      title: item.title,
      tags: item.tags,
      isFavorite: false
    }
  })
}

function fetchFeed(url, cb) {
  fetchJsonp(url, {
    jsonpCallback: 'jsoncallback',
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    return cb(json);
  })
  .catch(function(ex) {
    console.log('parsing failed', ex)
  })
}

class FlickrClient extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      activeFilter: SHOW_ALL_FILTER
    }

    this.handleShowAllClick = this.handleShowAllClick.bind(this);
    this.handleShowFavoriteClick = this.handleShowFavoriteClick.bind(this);
  }

  componentDidMount() {
    const init = () => {
      fetchFeed(this.props.feedApi, (feedData) => {
        const newFeedItems = mapFeedResponse(feedData);
        this.setState({
          items: unionBy(this.state.items, newFeedItems, 'photoUrl')
        });
      });
      setTimeout(init, this.props.fetchInterval);
    }
    init();
  }

  filteredItems() {
    switch (this.state.activeFilter) {
      case SHOW_FAVORITE_FILTER:
        return this.state.items.filter((item) => item.isFavorite);
        break;
      default:
        return this.state.items;
    }
  }

  findItemIndex(photoUrl) {
    return indexOf(this.state.items, find(this.state.items, {photoUrl: photoUrl}));
  }

  handleFavoriteButtonClick(photoUrl) {
    const items = this.state.items;
    const index = this.findItemIndex(photoUrl);
    const selecteditem = items[index];
    selecteditem.isFavorite = !selecteditem.isFavorite;
    items.splice(index, 1, selecteditem);
    this.setState({ items: items });
  }

  handleShowAllClick() {
    this.setState({ activeFilter: SHOW_ALL_FILTER });
  }

  handleShowFavoriteClick() {
    this.setState({ activeFilter: SHOW_FAVORITE_FILTER });
  }

  render() {
    return (
      <div>
        <Navbar fixedTop inverse>
          <Navbar.Header>
            <Navbar.Brand>
              Flickr Client
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem href="#" onClick={this.handleShowAllClick}>Show All</NavItem>
            <NavItem href="#" onClick={this.handleShowFavoriteClick}>Show Favorite</NavItem>
          </Nav>
        </Navbar>
        <ul className="list">
          {
            this.filteredItems().map((item) => (
              <Item
                key={item.photoUrl}
                author={item.author}
                photoUrl={item.photoUrl}
                isFavorite={item.isFavorite}
                onFavoriteButtonClick={() => this.handleFavoriteButtonClick(item.photoUrl)}
              />
            ))
          }
        </ul>
      </div>
    );
  }

}

FlickrClient.propTypes = {
  feedApi: string.isRequired,
  fetchInterval: number.isRequired
};

export default FlickrClient;
