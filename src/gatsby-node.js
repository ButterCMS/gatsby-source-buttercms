const butter = require('buttercms')
const crypto = require('crypto')

const typePrefix = 'butter__'

const refactoredEntityTypes = {
  post: `${typePrefix}POST`,
  contentField: `${typePrefix}CONTENT`
}

/* Main
** ***************************** */
exports.sourceNodes = async (
  { boundActionCreators, getNode, hasNodeChanged, store },
  { authToken, contentFields: { keys: contentFieldKeys = [], ...contentFieldOptions } }
) => {
  const {
    createNode,
    touchNode,
    setPluginStatus
  } = boundActionCreators

  // Authenticate butter api client
  const api = butter(authToken)

  // Touch existing ButterCMS nodes so Gatsby doesn't garbage collect them.
  Object.values(store.getState().nodes)
    .filter(n => n.internal.type.slice(0, 8) === typePrefix)
    .forEach(n => touchNode(n.id))

  // Fetch posts.
  let postResult
  try {
    postResult = await api.post.list()
  } catch (err) {
    console.log('error fetching posts', err)
  }

  const posts = postResult.data.data
  posts.forEach(post => {
    const gatsbyPost = Object.assign(
      {},
      post,
      {
        id: post.slug,
        children: [],
        parent: '__SOURCE__',
        internal: {
          type: refactoredEntityTypes.post
        }
      }
    )

    // get content digest of post
    const contentDigest = crypto
      .createHash('md5')
      .update(JSON.stringify(gatsbyPost))
      .digest('hex')

    gatsbyPost.internal.contentDigest = contentDigest

    createNode(gatsbyPost)
  })

  // Fetch content fields.
  let contentFieldsResult
  try {
    contentFieldsResult = await api.content.retrieve(contentFieldKeys, contentFieldOptions)
  } catch (err) {
    console.log('error fetching content fields', err)
  }

  const contentFieldEntries = Object.entries(contentFieldsResult.data.data)
  contentFieldEntries.forEach(([key, value]) => {
    const gatsbyContentField = Object.assign(
      {},
      key,
      value,
      {
        id: key,
        children: [],
        parent: '__SOURCE__',
        internal: {
          type: refactoredEntityTypes.contentField
        }
      }
    )

    // get content digest of content field
    const contentDigest = crypto
      .createHash('md5')
      .update(JSON.stringify(gatsbyContentField))
      .digest('hex')

    gatsbyContentField.internal.contentDigest = contentDigest

    createNode(gatsbyContentField)
  })

  setPluginStatus({
    status: {
      lastFetched: new Date().toJSON()
    }
  })
}
