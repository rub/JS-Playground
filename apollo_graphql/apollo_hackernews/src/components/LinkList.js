import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';

// feedQuery prop has 3 fields that provide information about the state of the
// network request: loading, error, and feed.
class LinkList extends Component {
  render() {
    // Is true as long as the request is still ongoing and the response
    // hasn't been received.
    if (this.props.feedQuery && this.props.feedQuery.loading) {
      return <div>Loading</div>
    }

    // In case the request fails, this field will contain information about
    // what exactly went wrong.
    if (this.props.feedQuery && this.props.feedQuery.error) {
      return <div>Error</div>
    }

    // The actual data received from the server
    const linksToRender = this.props.feedQuery.feed.links;

    return (
      <div>{linksToRender.map(link => <Link key={link.id} link={link} />)}</div>
    )
  }
}

// Store the query in a constant.
// The gql function parses the plain string that contains the GraphQL code.
const FEED_QUERY = gql`
  # Define the actual GraphQL query

  query FeedQuery {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

// Use the graphql container to "wrap" the LinkList component with the FEED_QUERY.
// We also pass an options object to the function call where we specify the name
// to be "feedQuery". If not specified it would be called "data" by default.
export default graphql(FEED_QUERY, { name: 'feedQuery' }) (LinkList);
