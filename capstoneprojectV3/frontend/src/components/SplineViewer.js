import React from 'react';
import '@splinetool/viewer';

function SplineViewer({ url }) {
  return (
    <spline-viewer
      url={url}
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: -1, // Always behind the content
        overflow: 'hidden', // Prevent scrolling issues
      }}
    />
  );
}

export default SplineViewer;
