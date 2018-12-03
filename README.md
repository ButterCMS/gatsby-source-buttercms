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
        // Optional. Returns values for the supplied content field keys.
        contentFields: {
          keys: [
            'homepage_title',
            'homepage_headline'
          ],
          // Optional. Set to 1 to enable test mode for viewing draft content.
          test: 0
        },
        // Optional. Array of page slugs.
        pages: [
          'page_slug'
        ],
        // Optional. Array of page types.
        pageTypes: [
          'page_type'
        ]
      }
    }
  ]
}
```

### Query Blog Posts

The plugin maps all JSON fields documented in the [Butter CMS API Reference](https://buttercms.com/docs/api/#blog-engine) to GraphQL fields.

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

### Query Pages

```GraphQL
{
  allButterPages {
    edges {
      node {
        slug
        # Your page’s fields …
      }
    }
  }
}
```
