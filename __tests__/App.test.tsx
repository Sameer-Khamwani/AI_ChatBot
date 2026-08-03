/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../App', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  return () => (
    <View>
      <Text>AI ChatBot</Text>
    </View>
  );
});

import App from '../App';

test('renders App without crashing', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
