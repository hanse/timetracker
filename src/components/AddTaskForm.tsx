import React, { FormEvent, memo } from 'react';
import { Button } from '@devmoods/ui';

type Props = {
  onSubmit: (task: string) => void;
};

function AddTaskForm({ onSubmit }: Props) {
  let input: HTMLInputElement | null | undefined;

  const handleSubmit = (e: FormEvent) => {
    if (!input) return;
    e.preventDefault();

    (window as any).gtag('event', 'Add task', {
      event_category: 'Tasks',
      event_label: input.value
    });

    input.value !== '' && onSubmit(input.value);
    input.value = '';
    input.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flex: 1,
        background: '#070a11',
        borderRadius: 4,
        padding: '10px'
      }}
    >
      <div style={{ flex: 1 }}>
        <input
          autoFocus
          ref={ref => (input = ref)}
          type="text"
          placeholder="What did you just start on?"
        />
      </div>

      <Button type="submit" style={{ width: 120, justifyContent: 'center' }}>
        Start
      </Button>
    </form>
  );
}

export default memo(AddTaskForm);
