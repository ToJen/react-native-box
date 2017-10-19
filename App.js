import './shim';
import React from 'react';
import SimpleStorageContract from './build/contracts/SimpleStorage.json';
import getWeb3 from './utils/getWeb3'
import { StyleSheet, Text, View } from 'react-native';
import Web3 from 'web3';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      storageValue: 0,
      web3: null
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });
        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log('Error finding web3.');
      });
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract');
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    let simpleStorageInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance;

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]});
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call({from: accounts[0]});
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] });
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Good to Go!</Text>
        <Text>Your Truffle Box is installed and ready.</Text>
        <Text>Smart Contract Example</Text>
        <Text>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</Text>
        <Text>Try changing the value stored on line 56 of App.js.</Text>
        <Text>The stored value is: {this.state.storageValue}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
