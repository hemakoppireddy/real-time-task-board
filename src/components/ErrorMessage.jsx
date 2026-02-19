function ErrorMessage({ message }) {
  return (
    <div role="alert" aria-live="assertive" className="error">
      {message}
    </div>
  );
}

export default ErrorMessage;
