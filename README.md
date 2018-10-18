# gatsby-source-buttercms

Source plugin for pulling blog posts, authors, categories, tags, and content fields into [Gatsby](https://www.gatsbyjs.org/) from [ButterCMS](https://buttercms.com/).

## Install

`npm install --save gatsby-source-buttercms`

## Usage

```JavaScript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-buttercms',
      options: {
        authToken: 'your_api_token',
        contentFields: {
          // Comma delimited list of content field keys.
          keys: [ 
            'homepage_title',
            'homepage_headline'
          ],
          // Optional. Set to 1 to enable test mode for viewing draft content.
          test: 0
        }
      }
    }
  ]
}
```

### Query Blog Posts
```GraphQL
{
  allButterPost {
    edges {
      node {
        id
        date
        url
        created
        published
        author {
          first_name
          last_name
          email
          slug
          bio
          title
          linkedin_url
          facebook_url
          instagram_url
          pinterest_url
          twitter_handle
          profile_image
        }
        categories {
          name
          slug
        }
        tags {
          name
          slug
        }
        featured_image
        slug
        title
        body
        summary
        seo_title
        meta_description
        status
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
