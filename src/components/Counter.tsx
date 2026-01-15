import { useState } from "react";

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <>
      <p>Counter: {count}</p>
      <button onClick={() => setCount(c => c + 5)}>Click +5</button>
      <button onClick={() => setCount(c => c - 5)}>Click -5</button>
    </>
  );
};

export default Counter;


