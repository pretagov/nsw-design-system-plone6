import React from 'react';

const Sidebar = ({ sidebarPosition, MainComponent, SidebarComponent }) => {
  return (
    <div className="nsw-container">
      <div className="nsw-layout">
        {sidebarPosition === 'left' ? (
          <>
            <div className="nsw-layout__sidebar">
              {SidebarComponent ?? null}
            </div>
            <div className="nsw-layout__main">{MainComponent ?? null}</div>
          </>
        ) : (
          <>
            <div className="nsw-layout__main">{MainComponent ?? null}</div>
            <div className="nsw-layout__sidebar">
              {SidebarComponent ?? null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
