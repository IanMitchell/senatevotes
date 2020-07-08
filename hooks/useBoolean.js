import { useState } from 'react';

export default function useBoolean(initialValue) {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    set: setValue,
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
    toggle: () => setValue((current) => !current),
  };
}
