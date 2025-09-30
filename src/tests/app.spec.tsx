import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import {server} from "../mocks/node.ts";
import {http, HttpResponse} from "msw";
import {afterAll, afterEach, beforeAll, describe, expect, it} from 'vitest';

describe('App Component', () => {
  // Use MSW instead of JEST mocking as we are already using MSW for API mocking
  beforeAll(() => server.listen())
  afterEach(() => {
    server.resetHandlers();
    cleanup()
  })
  afterAll(() => server.close())

  it('renders form correctly with all fields', async () => {
    render(<App/>);

    await waitFor(() => {
      expect(screen.getByText('Consignment Form'));
    });

    expect(screen.getByLabelText(/source/i));
    expect(screen.getByLabelText(/destination/i));
    expect(screen.getByLabelText(/weight/i));
    expect(screen.getByLabelText(/unit/i));
    expect(screen.getByLabelText(/height/i));
    expect(screen.getByLabelText(/depth/i));
    expect(screen.getByLabelText(/width/i));
    expect(screen.getByRole('button', {name: /submit/i}));
  });

  it('validation errors trigger when inputs are invalid', async () => {
    const user = userEvent.setup();
    render(<App/>);

    await waitFor(() => {
      expect(screen.getByText('Consignment Form'));
    });

    const weightInput = screen.getByLabelText(/weight/i);
    await user.clear(weightInput);
    await user.type(weightInput, '0');

    await waitFor(() => {
      expect(screen.getByText('Weight must be at least 1kg'));
    });

    await user.clear(weightInput);
    await user.type(weightInput, '1001');

    await waitFor(() => {
      expect(screen.getByText('Weight cannot exceed 1000kg'));
    });
  });

  it('API data is correctly fetched and displayed in dropdowns', async () => {
    render(<App/>);

    await waitFor(() => {
      expect(screen.getAllByRole('option', {name: 'Perth'}));
      expect(screen.getAllByRole('option', {name: 'Adelaide'}));
      expect(screen.getAllByRole('option', {name: 'Sydney'}));
    });
  });

  it('successful form submission calls the API', async () => {
    const user = userEvent.setup();
    render(<App/>);

    await waitFor(() => {
      expect(screen.getByText('Consignment Form'));
    });

    const sourceSelect = screen.getByLabelText(/source/i);
    const destinationSelect = screen.getByLabelText(/destination/i);
    const weightInput = screen.getByLabelText(/weight/i);
    const heightInput = screen.getByLabelText(/height/i);
    const depthInput = screen.getByLabelText(/depth/i);
    const widthInput = screen.getByLabelText(/width/i);

    await user.selectOptions(sourceSelect, 'Perth');
    await user.selectOptions(destinationSelect, 'Sydney');
    await user.type(weightInput, '10');
    await user.type(heightInput, '20');
    await user.type(depthInput, '30');
    await user.type(widthInput, '40');

    const submitButton = screen.getByRole('button', {name: /submit/i});
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Consignment submitted successfully!'));
    });
  });

  it('submit button is disabled if required missing', async () => {
    const user = userEvent.setup();
    render(<App/>);

    await waitFor(() => {
      expect(screen.getByText('Consignment Form'));
    });

    const sourceSelect = screen.getByLabelText(/source/i);
    const destinationSelect = screen.getByLabelText(/destination/i);
    const weightInput = screen.getByLabelText(/weight/i);

    await user.selectOptions(sourceSelect, 'Perth');
    await user.selectOptions(destinationSelect, 'Sydney');
    await user.type(weightInput, '10');

    const submitButton = screen.getByRole('button', {name: /submit/i});
    expect(submitButton.getAttribute('disabled')).toBe("");
  });

  it('displays error when form submission fails', async () => {
    server.use(
      http.post('/api/submit-consignment', () => {
        return HttpResponse.json({message: 'Submission failed'}, {status: 400});
      })
    );

    const user = userEvent.setup();
    render(<App/>);

    await waitFor(() => {
      expect(screen.getByText('Consignment Form'));
      expect(screen.getByLabelText(/source/i));
      expect(screen.getByLabelText(/destination/i));
    });

    const sourceSelect = screen.getByLabelText(/source/i);
    const destinationSelect = screen.getByLabelText(/destination/i);
    const weightInput = screen.getByLabelText(/weight/i);
    const heightInput = screen.getByLabelText(/height/i);
    const depthInput = screen.getByLabelText(/depth/i);
    const widthInput = screen.getByLabelText(/width/i);

    // Fill ALL required fields
    await user.selectOptions(sourceSelect, 'Perth');
    await user.selectOptions(destinationSelect, 'Sydney');
    await user.type(weightInput, '10');
    await user.type(heightInput, '10');
    await user.type(depthInput, '10');
    await user.type(widthInput, '10');

    // Wait for button to be enabled
    const submitButton = screen.getByRole('button', {name: /submit/i});
    await waitFor(() => {
      expect(submitButton);
    });

    await user.click(submitButton);

    // Wait for error message to appear
    const errorMessage = await screen.findByText('Submission failed');
    expect(errorMessage);
  });

  it('displays error when API fetch fails', async () => {
    server.use(
      http.get('/api/location', () => {
        return HttpResponse.error();
      })
    );

    render(<App/>);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch'));
    });
  });

  it('prevents same source and destination selection', async () => {
    const user = userEvent.setup();
    render(<App/>);

    await waitFor(() => {
      expect(screen.getByText('Consignment Form'));
    });

    const sourceSelect = screen.getByLabelText(/source/i);
    const destinationSelect = screen.getByLabelText(/destination/i);

    await user.selectOptions(sourceSelect, 'Perth');

    await waitFor(() => {
      const perthOption = destinationSelect.querySelector('option[value="Perth"]') as HTMLOptionElement;
      expect(perthOption?.disabled).toBe(true);
    });
  });

  it('unit conversion works correctly', async () => {
    const user = userEvent.setup();
    render(<App/>);

    await waitFor(() => {
      expect(screen.getByText('Consignment Form'));
    });

    const unitSelect = screen.getByLabelText(/unit/i);
    const heightInput = screen.getByLabelText(/height/i);

    await user.type(heightInput, '10');
    await user.selectOptions(unitSelect, 'millimetres');

    await waitFor(() => {
      expect((heightInput as HTMLInputElement).value).toBe('1000');
    });
  });
});