import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Game } from "../lib/supabase";
import Tag from "../components/Tag";
import Carousel from "../components/Carousel";

const EMULATOR_LINKS: Record<string, { name: string; url: string }> = {
  PSP: { name: "PPSSPP", url: "https://www.ppsspp.org/downloads.html" },
  PS2: { name: "AetherSX2", url: "https://www.aethersx2.com" },
};

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) fetchGame(id);
  }, [id]);

  const fetchGame = async (gameId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setGame(data as Game);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="detail-layout">
        <div className="skeleton" style={{ height: 400, marginBottom: 24 }} />
        <div className="skeleton skeleton-line" style={{ height: 20, marginBottom: 12, width: "60%" }} />
        <div className="skeleton skeleton-line" style={{ height: 48, marginBottom: 24, width: "80%" }} />
      </div>
    );
  }

  if (notFound || !game) {
    return (
      <div className="detail-layout">
        <div className="empty-state">
          <div className="empty-state-icon">😞</div>
          <h3>Game Tidak Ditemukan</h3>
          <p>Game yang kamu cari tidak ada atau sudah dihapus.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const emulator = EMULATOR_LINKS[game.platform];

  return (
    <div>
      {/* Back Button */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 20px 0" }}>
        <button className="detail-back" onClick={() => navigate(-1)}>
          ← Kembali
        </button>
      </div>

      <div className="detail-layout" style={{ paddingTop: 0 }}>
        {/* 1. Poster */}
        {game.cover_url ? (
          <img
            src={game.cover_url}
            alt={game.name}
            className="detail-poster"
          />
        ) : (
          <div className="detail-poster-placeholder">🎮</div>
        )}

        {/* 2. Tags */}
        <div className="detail-tags">
          <Tag label={game.platform} variant="platform" />
          {(game.genres || []).map((g) => (
            <Tag key={g} label={g} variant="genre" />
          ))}
          <Tag label={game.file_size} variant="size" />
        </div>

        {/* 3. Game Name */}
        <h1 className="detail-title">{game.name}</h1>

        {/* 4. Carousel Screenshots */}
        <div className="detail-section">
          <div className="detail-section-label">Screenshots</div>
          <Carousel images={game.screenshots || []} altPrefix={game.name} />
        </div>

        {/* 5. Info Game */}
        <div className="detail-section">
          <div className="detail-section-label">Tentang Game</div>
          <p className="detail-desc">{game.description || "Tidak ada deskripsi tersedia."}</p>
        </div>

        <div className="detail-section">
          <div className="detail-section-label">Informasi</div>
          <div className="detail-info-grid">
            <div className="detail-info-item">
              <div className="detail-info-label">Platform</div>
              <div className="detail-info-value">{game.platform}</div>
            </div>
            <div className="detail-info-item">
              <div className="detail-info-label">Ukuran File</div>
              <div className="detail-info-value">{game.file_size}</div>
            </div>
            <div className="detail-info-item">
              <div className="detail-info-label">Genre</div>
              <div className="detail-info-value" style={{ fontSize: 14, lineHeight: 1.4 }}>
                {(game.genres || []).join(", ")}
              </div>
            </div>
            <div className="detail-info-item">
              <div className="detail-info-label">Ditambahkan</div>
              <div className="detail-info-value" style={{ fontSize: 14 }}>
                {new Date(game.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 6. Download Button */}
        <div className="detail-section">
          <div className="detail-download-wrap">
            <div className="detail-download-info">
              <h3>Siap Download?</h3>
              <p>File ISO {game.platform} — {game.file_size}</p>
            </div>
            <a
              href={game.download_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={{ textDecoration: "none" }}
            >
              ⬇ Download {game.name}
            </a>
          </div>
        </div>

        {/* 7. Notice Emulator */}
        {emulator && (
          <div className="detail-emulator-notice">
            <span className="detail-emulator-notice-icon">💡</span>
            <p>
              Belum punya {emulator.name}?{" "}
              <a href={emulator.url} target="_blank" rel="noopener noreferrer">
                Download {emulator.name} di sini
              </a>{" "}
              untuk bisa memainkan game {game.platform} ini.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-logo">CDMonza</span>
          <span className="footer-text">Platform download game PSP & PS2</span>
        </div>
      </footer>
    </div>
  );
};

export default Detail;
