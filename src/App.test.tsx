import { render, screen } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Task Manager App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the task manager heading and form', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /track your work with ease/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add a new task/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('adds and deletes a task', async () => {
    render(<App />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add a new task/i);
    const addButton = screen.getByRole('button', { name: /add task/i });

    await act(async () => {
      await user.type(input, 'Write unit tests');
      await user.click(addButton);
    });

    expect(screen.getByText('Write unit tests')).toBeInTheDocument();
    expect(screen.getByText(/1 tasks/i)).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /delete task write unit tests/i });
    await act(async () => {
      await user.click(deleteButton);
    });

    expect(screen.queryByText('Write unit tests')).not.toBeInTheDocument();
    expect(screen.getByText(/0 tasks/i)).toBeInTheDocument();
  });

  it('toggles completion and filters tasks correctly', async () => {
    render(<App />);
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/add a new task/i);
    const addButton = screen.getByRole('button', { name: /add task/i });

    await act(async () => {
      await user.type(input, 'First task');
      await user.click(addButton);
    });

    expect(input).toHaveValue('');
    expect(screen.getByText('First task')).toBeInTheDocument();

    await act(async () => {
      await user.type(input, 'Second task');
      await user.click(addButton);
    });

    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();

    const firstToggle = screen.getByRole('button', {
      name: /mark task first task as completed/i,
    });
    await act(async () => {
      await user.click(firstToggle);
    });

    expect(screen.getByText('First task')).toHaveClass('task-label completed');

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /^Completed$/i }));
    });
    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.queryByText('Second task')).not.toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getByRole('button', { name: /^Pending$/i }));
    });
    expect(screen.getByText('Second task')).toBeInTheDocument();
    expect(screen.queryByText('First task')).not.toBeInTheDocument();
  });
});
