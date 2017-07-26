# gatsby-source-buttercms

Source plugin for pulling blog posts, authors, categories, tags, and content fields into [Gatsby](https://www.gatsbyjs.org/) from [Butter CMS](https://buttercms.com/).

## Install
`npm install --save gatsby-source-buttercms`

## How to use
```JavaScript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-buttercms',
      options: {
        authToken: 'your_api_token',
        contentFields: {
          keys: [ // Comma delimited list of content field keys.
            'homepage_title',
            'homepage_headline'
          ],
          test: 0 // Optional. Set to 1 to enable test mode for viewing draft content.
        }
      }
    }
  ]
}
```

## How to query : GraphQL

### Query Blog Posts
```GraphQL
{
  allButterPost {
    edges {
      node {
        slug
        url
        published
        created
        status
        title
        body
        summary
        seo_title
        meta_description
        author {
          slug
          first_name
          last_name
          email
          bio
          title
          linkedin_url
          facebook_url
          pinterest_url
          instagram_url
          twitter_handle
          profile_image
        }
      }
    }
  }
}
```

### Query Content Fields
```GraphQL
{
  allButterContent {
    edges {
      node {
        key
        value
      }
    }
  }
}
```
