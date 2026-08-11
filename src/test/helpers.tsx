import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

export const renderWithRouter = (ui: React.ReactElement, initialEntries = ['/']) => {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>);
};
