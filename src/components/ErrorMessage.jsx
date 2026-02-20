import { useEffect, useState } from "react";

function ErrorMessage({ message }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="error" role="alert">
      {message}
    </div>
  );
}

export default ErrorMessage;