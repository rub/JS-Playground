import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={this.state.url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button onClick={() => this._createLink()}>Submit</button>
      </div>
    )
  }

  // Pass the variables that represent the user input
  _createLink = async () => {
    const { description, url } = this.state
    await this.props.postMutation({
      variables: {
        description,
        url
      }
    });
    this.props.history.push('/');
  }
}

// Store the mutation in a constant.
const POST_MUTATION = gql`
  # Define the actual GraphQL mutation
  # It takes two arguments, description and url, that you'll have to provide
  # when invoking the mutation

  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

// Use the graphql container to combine the CreateLink component with the
// mutation. We also inject a function into the component's props.
export default graphql(POST_MUTATION, { name: 'postMutation' }) (CreateLink);
