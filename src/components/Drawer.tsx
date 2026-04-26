import React from "react";

const PLATFORMS = ["PSP", "PS2"];

const GENRES = [
  "Action",
  "RPG",
  "Fighting",
  "Sports",
  "Racing",
  "Strategy",
  "Adventure",
  "Simulation",
  "Puzzle",
  "Horror",
  "Shooter",
  "Platform",
];

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatform: string;
  selectedGenre: string;
  onPlatformChange: (platform: string) => void;
  onGenreChange: (genre: string) => void;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  selectedPlatform,
  selectedGenre,
  onPlatformChange,
  onGenreChange,
}) => {
  const handlePlatformClick = (platform: string) => {
    onPlatformChange(selectedPlatform === platform ? "" : platform);
  };

  const handleGenreClick = (genre: string) => {
    onGenreChange(selectedGenre === genre ? "" : genre);
  };

  return (
    <>
      <div
        className={`drawer-overlay${isOpen ? " open" : ""}`}
        onClick={onClose}
      />
      <aside className={`drawer${isOpen ? " open" : ""}`} aria-hidden={!isOpen}>
        <div className="drawer-header">
          <span className="drawer-logo">CD<span style={{ color: "var(--white)" }}>Monza</span></span>
          <button className="drawer-close" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="drawer-section">
          <div className="drawer-section-title">Platform</div>
          <div className="drawer-filter-list">
            {PLATFORMS.map((platform) => (
              <button
                key={platform}
                className={`drawer-filter-item${selectedPlatform === platform ? " active" : ""}`}
                onClick={() => handlePlatformClick(platform)}
              >
                <span className="drawer-filter-item-dot" />
                {platform === "PSP" ? "PSP (PPSSPP)" : "PS2 (AetherSX2)"}
              </button>
            ))}
          </div>
        </div>

        <div className="drawer-section">
          <div className="drawer-section-title">Genre</div>
          <div className="drawer-filter-list">
            {GENRES.map((genre) => (
              <button
                key={genre}
                className={`drawer-filter-item${selectedGenre === genre ? " active" : ""}`}
                onClick={() => handleGenreClick(genre)}
              >
                <span className="drawer-filter-item-dot" />
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="drawer-footer">
          <button
            className="btn btn-outline"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => {
              onPlatformChange("");
              onGenreChange("");
              onClose();
            }}
          >
            Reset Filter
          </button>
        </div>
      </aside>
    </>
  );
};

export default Drawer;
