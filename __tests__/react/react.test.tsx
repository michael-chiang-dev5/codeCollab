import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from '../../src/client/redux/store';
import CodeEditor from '../../src/client/components/CollabCodeEditor/CodeEditor';

const wrap = (jsx: JSX.Element) => {
  return <Provider store={store}>{jsx}</Provider>;
};
describe('App component', () => {
  it('has text', () => {
    render(wrap(<CodeEditor initialText="12345" />));
    expect(screen.getByText('12345')).toBeInTheDocument();
  });
});
