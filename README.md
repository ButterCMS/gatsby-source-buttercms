![recommended node version](https://img.shields.io/badge/node-v18-green)

# ButterCMS Gatsby Source Plugin

Source plugin for pulling blog posts, authors, categories, tags, and content fields into [Gatsby](https://www.gatsbyjs.org/) from [ButterCMS](https://buttercms.com/). 

*This version (3.0.0) is designed to work with Gatsby 5.0 and above, which only supports node 18 and above. If you want to use our plugin with Gatsby 4, you can use v2.2.6 of this package.*

## Install

`npm install` to install this repo as a standalone, or `npm install --save gatsby-source-buttercms` to install the gatsy-source-buttercms package into your current gatsby project.

## Configuration

Add to your `gatsby-config.js`.

```JavaScript
module.exports = {
  plugins: [
     {
        resolve: `gatsby-source-buttercms`,
        options: {
              authToken: `<API_TOKEN>`,
              // Optional array of Collection key 
              contentFields: {
                keys: [`navigation_menu`],
                // Optional. Set to 1 to enable test mode for viewing draft content.
                test: 0,
              },
              // Optional array of page type keys
              pageTypes: [`landing-page`],
              // Optional array of locales (if configured in your account)
              locales: [],
              preview: 1, // Return draft content
              levels: 2 // Optional. Defaults to 2. Defines the levels of relationships to serialize
        },
    }
  ]
}
```

## Usage

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

### Query Content Fields(Object)

```GraphQL
{
  allButterContentField {
    edges {
      node {
        key
        value
      }
    }
  }
}
```

### Query Content Fields(Collection)

```GraphQL
{
  allButterCollection {
    edges {
      node {
        key
        value{
          #Your collection fields
        }
      }
    }
  }
}
```

### Query Pages

Page meta data is available in `meta` object. The `slug` and `page_title` fields are now deprecated and will be removed on 20/06/2021. Please, use `meta` field to get the `slug` and `page_type`.

```GraphQL
{
  allButterPage {
    edges {
      node {
        slug # is deprecated
        page_type # is deprecated
        meta {
          published
          updated
          name
          page_type
          slug
        }
        # Your page’s fields …
      }
    }
  }
}
```

### Other

View our [Gatsby Blog engine](https://buttercms.com/gatsbyjs-blog-engine/) and [Gatsby Full CMS](https://buttercms.com/gatsbyjs-cms/) for other examples of using ButterCMS with Gatsby.
