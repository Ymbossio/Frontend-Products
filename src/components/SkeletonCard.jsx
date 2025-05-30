import React from "react";

export function SkeletonCardBootstrap() {
  return (
    <div className="card h-100 text-center shadow-sm m-2" style={{ width: '18rem' }}>
      <div className="card-img-top placeholder-glow" style={{ height: '250px' }}>
        <span className="placeholder col-12" style={{ height: '250px' }}></span>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title placeholder-glow">
          <span className="placeholder col-6"></span>
        </h5>
        <p className="card-text placeholder-glow">
          <span className="placeholder col-7"></span>
        </p>
        <p className="card-text placeholder-glow fw-bold text-primary">
          <span className="placeholder col-4"></span>
        </p>
        <p className="card-text placeholder-glow text-muted">
          <span className="placeholder col-3"></span>
        </p>
        <button className="btn btn-primary disabled placeholder mt-auto" tabIndex={-1}></button>
      </div>
    </div>
  );
}
