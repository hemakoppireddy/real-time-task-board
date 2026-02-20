function LoadingSpinner() {
  return (
    <div className="skeleton-wrapper">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton-column">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSpinner;