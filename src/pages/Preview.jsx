import qs from 'qs';
import {useEffect} from 'react';

import {client, linkResolver} from '../prismic-configuration';

const Preview = ({history, location}) => {
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const {token} = qs.parse(location.search.slice(1));

    if (!token) {
      return 'Unable to retrieve the session token from provided url.';
    }

    client.previewSession(token, linkResolver, '/').then(url => history.push(url));
  });

  return 'Hej';
};

export default Preview;
