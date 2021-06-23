import Prismic from 'prismic-javascript';

export const apiEndpoint = 'https://trisvonnamichell.cdn.prismic.io/api/v2';

export const linkResolver = (doc) => {
  if (doc.type === 'work') return `/${doc.uid}`;
  return '/';
};

export const client = Prismic.client(apiEndpoint);
