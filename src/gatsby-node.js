const butter = require('buttercms');
const crypto = require('crypto');

const typePrefix = 'butter__';

const refactoredEntityTypes = {
  post: `${typePrefix}POST`,
  contentField: `${typePrefix}CONTENT`
};

exports.sourceNodes = async (
  { actions, getNode, getNodes, createNodeId, hasNodeChanged, store },
  {
    authToken,
    contentFields: { keys: contentFieldKeys = [], ...contentFieldOptions }
  }
) => {
  const { createNode, touchNode, setPluginStatus } = actions;

  // Authenticate ButterCMS API client.
  const api = butter(authToken);

  // Touch existing ButterCMS nodes so Gatsby doesn’t garbage collect them.
  Object.values(store.getState().nodes)
    .filter(n => n.internal.type.slice(0, 8) === typePrefix)
    .forEach(n => touchNode(n.id));

  // Fetch posts.
  let postResult;
  try {
    postResult = await api.post.list({
      page_size: Number.MAX_SAFE_INTEGER
    });
  } catch (err) {
    console.log('Error fetching posts', err);
  }

  // TODO Document non-ButterCMS field `date`.

  const posts = postResult.data.data;
  posts.forEach(post => {
    const gatsbyPost = Object.assign(
      { date: new Date(post.published).toLocaleDateString('en-US') },
      post,
      {
        id: createNodeId(post.slug),
        parent: null,
        children: [],
        internal: {
          type: refactoredEntityTypes.post,
          mediaType: `application/json`,
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify(post))
            .digest(`hex`)
        }
      }
    );

    createNode(gatsbyPost);
  });

  // TODO Make content fields option in `gatsby-node.js` optional.

  // Fetch content fields.
  let contentFieldsResult;
  try {
    contentFieldsResult = await api.content.retrieve(
      contentFieldKeys,
      contentFieldOptions
    );
  } catch (err) {
    console.log('Error fetching content fields', err);
  }

  if (contentFieldsResult.data.data) {
    const contentFields = Object.entries(contentFieldsResult.data.data);
    contentFields.forEach(([key, value]) => {
      const gatsbyContentField = Object.assign({}, key, value, {
        id: key,
        parent: null,
        children: [],
        internal: {
          type: refactoredEntityTypes.contentField,
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify([key, value]))
            .digest(`hex`)
        }
      });

      createNode(gatsbyContentField);
    });
  }

  // TODO Fetch pages.

  setPluginStatus({
    status: {
      lastFetched: Date.now()
    }
  });
};
