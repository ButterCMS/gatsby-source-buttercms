const butter = require('buttercms')
const crypto = require('crypto')

const typePrefix = 'butter__'

const refactoredEntityTypes = {
  post: `${typePrefix}POST`
}

/* Main
** ***************************** */
exports.sourceNodes = async (
  { boundActionCreators, getNode, hasNodeChanged, store },
  { authToken }
) => {
  const {
    createNode,
    touchNode,
    setPluginStatus
  } = boundActionCreators

  // Touch existing ButterCMS nodes so Gatsby doesn't garbage collect them.
  Object.values(store.getState().nodes)
    .filter(n => n.internal.type.slice(0, 8) === typePrefix)
    .forEach(n => touchNode(n.id))

  // Fetch posts.
  let postResult
  try {
    postResult = await butter(authToken).post.list()
  } catch (err) {
    console.log('error fetching posts', err)
  }

  setPluginStatus({
    status: {
      lastFetched: new Date().toJSON()
    }
  })

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
}
