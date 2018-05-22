import React, { Component } from 'react';
import { render } from 'react-dom';

import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from 'react-apollo';
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "https://nx9zvp49q7.lp.gql.zone/graphql"
});

// The GraphQL query
const GET_DOGS = gql`
  {
    dogs {
      id
      breed
    }
  }
`;

const Dogs = ({ onDogSelected }) => (
  // Pass the GraphQL query to the query prop
  <Query query={GET_DOGS}>
    {/* Call properties from the Apollo Client you can use to render the UI
      depending on the state of the query */}
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <select name="dog" onChange={onDogSelected}>
          {data.dogs.map(dog => (
            <option key={dog.id} value={dog.breed}>
              {dog.breed}
            </option>
          ))}
        </select>
      )
    }}
  </Query>
)

const GET_DOG_PHOTO = gql`
  query dog($breed: String!) {
    dog(breed: $breed) {
      id
      displayImage
    }
  }
`;

const DogPhoto = ({ breed }) => (
  <Query
    query={GET_DOG_PHOTO}
    variables={{ breed }}
    skip={!breed}
    // pollInterval={500}
    notifyOnNetworkStatusChange
  >
    {({ loading, error, data, refetch, networkStatus }) => {
      if (networkStatus === 4) return "Refetching!";
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return (
        <div>
          <img
            src={data.dog.displayImage}
            style={{ height: 100, width: 100 }}
            alt=""
          />
          <button onClick={() => refetch()}>Refetch!</button>
        </div>
      );
    }}
  </Query>
)

class App extends Component {
  state = { selectedDog: null };

  onDogSelected = ({ target }) => {
    this.setState(() => ({ selectedDog: target.value }));
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <h2>My first Apollo app <span role="img" aria-label="rocket">🚀</span></h2>
          {this.state.selectedDog && (
            <DogPhoto breed={this.state.selectedDog} />
          )}
          <Dogs onDogSelected={this.onDogSelected} />
        </div>
      </ApolloProvider>
    )
  }
}

render(<App />, document.getElementById('root'));
