const butter = require('buttercms');
const crypto = require('crypto');

const typePrefix = 'butter__';

const refactoredEntityTypes = {
  post: `${typePrefix}POST`,
  contentField: `${typePrefix}CONTENT`,
  page: `${typePrefix}PAGE`
};

exports.sourceNodes = async (
  { actions, getNode, getNodes, createNodeId, hasNodeChanged, store },
  { authToken, contentFields, pages, pageTypes }
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

  // Fetch content fields.
  if (contentFields) {
    const {
      keys: contentFieldKeys = [],
      ...contentFieldOptions
    } = contentFields;

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
  }

  // Fetch pages.
  if (pages) {
    const pagesResult = [];
    try {
      for (let i = 0; i < pages.length; i++) {
        const pageResult = await api.page.retrieve('*', pages[i], {
          preview: 1
        });
        pagesResult.push(pageResult.data.data);
      }
    } catch (err) {
      console.log('Error fetching pages', err);
    }

    // Fetch page types
    if (pageTypes) {
      try {
        for (let i = 0; i < pageTypes.length; i++) {
          const pageTypeResult = await api.page.list(pageTypes[i], {
            preview: 1
          });
          pageTypeResult.data.data.forEach(page => {
            // allButterPage(filter: {page_type: {eq: "page_type"}})
            page.fields.page_type = pageTypes[i];
            pagesResult.push(page);
          });
        }
      } catch (err) {
        console.log('Error fetching page types', err);
      }
    }

    // Fix GraphQL introspection for pages with different fields
    const keys = pagesResult.reduce((acc, page) => {
      const fields = Object.keys(page.fields);
      return Array.from(new Set(acc.concat(fields)));
    }, []);
    const emptyPageObject = keys.reduce((acc, obj) => {
      acc[obj] = null;
      return acc;
    }, {});
    console.log(emptyPageObject);

    pagesResult.forEach(page => {
      const gatsbyPage = Object.assign(
        emptyPageObject,
        { slug: page.slug },
        page.fields,
        {
          id: createNodeId(page.slug),
          parent: null,
          children: [],
          internal: {
            type: refactoredEntityTypes.page,
            mediaType: `application/json`,
            contentDigest: crypto
              .createHash(`md5`)
              .update(JSON.stringify(page))
              .digest(`hex`)
          }
        }
      );

      createNode(gatsbyPage);
    });
  }

  setPluginStatus({
    status: {
      lastFetched: Date.now()
    }
  });
};
