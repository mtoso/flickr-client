import React from 'react';
import { render } from 'react-dom';
import FlickrClient from './lib';

const FEED_API = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json';
const FETCH_INTERVAL = 1000; // 1 min

render(
  <FlickrClient feedApi={FEED_API} fetchInterval={FETCH_INTERVAL} />,
  document.getElementById('container')
);
