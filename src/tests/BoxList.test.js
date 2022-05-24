import { render, screen } from '@testing-library/react';
import BoxList from '../components/BoxList';

test('renders learn react link', () => {
  render(<BoxList />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
