import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Game } from "../lib/supabase";
import GameCard from "../components/GameCard";
import Drawer from "../components/Drawer";

const PLATFORMS = ["PSP", "PS2"];

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-cover" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line-sm" />
    </div>
  </div>
);

const Home: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGames(data as Game[]);
    }
    setLoading(false);
  };

  const filtered = games.filter((g) => {
    const matchSearch =
      !search ||
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase());
    const matchPlatform = !platform || g.platform === platform;
    const matchGenre =
      !genre ||
      (g.genres && g.genres.some((gen) => gen.toLowerCase() === genre.toLowerCase()));
    return matchSearch && matchPlatform && matchGenre;
  });

  const activeFilters = [platform, genre].filter(Boolean).length;

  return (
    <div className="page-layout">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-logo">
            CD<span>Monza</span>
          </div>

          <div className="header-search">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input
                className="search-input"
                type="text"
                placeholder="Cari game..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="header-actions">
            <button
              className="btn-icon"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open filter menu"
              style={{ position: "relative" }}
            >
              ☰
              {activeFilters > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    background: "var(--purple-accent)",
                    color: "#fff",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid var(--bg-primary)",
                    lineHeight: 1,
                  }}
                >
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedPlatform={platform}
        selectedGenre={genre}
        onPlatformChange={(p) => { setPlatform(p); setDrawerOpen(false); }}
        onGenreChange={(g) => { setGenre(g); setDrawerOpen(false); }}
      />

      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-label">Platform Download Game Retro</div>
          <h1 className="home-hero-title">
            CD<span>Monza</span>
          </h1>
          <p className="home-hero-desc">
            Koleksi game PSP & PS2 terbaik untuk dimainkan dengan PPSSPP dan AetherSX2. Gratis, lengkap, dan siap main.
          </p>
        </div>
      </div>

      {/* Mobile Search */}
      <div style={{ padding: "12px 20px", borderBottom: "var(--border)" }}>
        <div className="search-wrap" style={{ display: "block" }}>
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            type="text"
            placeholder="Cari game..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ display: "block" }}
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="home-filter-bar">
        <span className="home-filter-label">Platform:</span>
        {PLATFORMS.map((p) => (
          <button
            key={p}
            className={`filter-chip${platform === p ? " active" : ""}`}
            onClick={() => setPlatform(platform === p ? "" : p)}
          >
            {p}
          </button>
        ))}
        {(platform || genre) && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setPlatform(""); setGenre(""); }}
            style={{ marginLeft: "auto" }}
          >
            ✕ Reset
          </button>
        )}
        {genre && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--purple-light)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Genre: {genre}
            <button
              onClick={() => setGenre("")}
              style={{
                background: "none",
                border: "none",
                color: "var(--gray-muted)",
                cursor: "pointer",
                fontSize: 14,
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </span>
        )}
      </div>

      {/* Content */}
      <main className="home-content">
        <div className="home-results-header">
          <span className="home-results-count">
            {loading ? "Memuat..." : `${filtered.length} Game Ditemukan`}
          </span>
        </div>

        {loading ? (
          <div className="game-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎮</div>
            <h3>Tidak Ada Game</h3>
            <p>
              {search || platform || genre
                ? "Tidak ada game yang cocok dengan filter kamu. Coba ubah pencarian."
                : "Belum ada game yang tersedia."}
            </p>
            {(search || platform || genre) && (
              <button
                className="btn btn-outline"
                onClick={() => { setSearch(""); setPlatform(""); setGenre(""); }}
              >
                Reset Semua
              </button>
            )}
          </div>
        ) : (
          <div className="game-grid">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-logo">CDMonza</span>
          <span className="footer-text">Platform download game PSP & PS2</span>
          <span className="footer-text">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
