# gatsby-source-buttercms

Source plugin for pulling blog posts, authors, categories, tags, and content fields into Gatsby from [Butter CMS](https://buttercms.com/).

## Install
`npm install --save gatsby-source-buttercms`

## How to use
```JavaScript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-buttercms',
      options: {
        authToken: 'your_api_token'
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
