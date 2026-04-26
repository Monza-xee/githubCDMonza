import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import type { Game } from "../../lib/supabase";
import Tag from "../../components/Tag";

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = Omit<Game, "id" | "created_at"> & {
  genres_input: string;
  screenshots_input: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  file_size: "",
  platform: "PSP",
  genres: [],
  genres_input: "",
  download_link: "",
  cover_url: "",
  screenshots: [],
  screenshots_input: "",
};

// ─── Toast ───────────────────────────────────────────────────────────────────

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────

const ConfirmDialog: React.FC<{
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal" style={{ maxWidth: 360 }}>
      <div className="modal-header">
        <span className="modal-title">Konfirmasi</span>
      </div>
      <div className="modal-body">
        <p style={{ color: "var(--white-dim)", fontSize: 15 }}>{message}</p>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>Batal</button>
        <button className="btn btn-danger btn-sm" onClick={onConfirm}>Hapus</button>
      </div>
    </div>
  </div>
);

// ─── Game Form Modal ──────────────────────────────────────────────────────────

const GameFormModal: React.FC<{
  initial?: Game | null;
  onSave: (data: Omit<Game, "id" | "created_at">) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}> = ({ initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState<FormData>(() =>
    initial
      ? {
          ...initial,
          genres_input: initial.genres.join(", "),
          screenshots_input: (initial.screenshots || []).join("\n"),
        }
      : { ...EMPTY_FORM }
  );

  const set = (key: keyof FormData, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<Game, "id" | "created_at"> = {
      name: form.name,
      description: form.description,
      file_size: form.file_size,
      platform: form.platform as "PSP" | "PS2",
      genres: form.genres_input
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      download_link: form.download_link,
      cover_url: form.cover_url,
      screenshots: form.screenshots_input
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    await onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{initial ? "Edit Game" : "Tambah Game"}</span>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Nama Game *</label>
              <input className="form-input" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Platform *</label>
              <select
                className="form-input"
                value={form.platform}
                onChange={(e) => set("platform", e.target.value)}
                style={{ background: "var(--bg-primary)" }}
              >
                <option value="PSP">PSP</option>
                <option value="PS2">PS2</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ukuran File *</label>
                <input className="form-input" placeholder="e.g. 500 MB" value={form.file_size} onChange={(e) => set("file_size", e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Genre (koma) *</label>
                <input className="form-input" placeholder="Action, RPG" value={form.genres_input} onChange={(e) => set("genres_input", e.target.value)} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Deskripsi</label>
              <textarea
                className="form-input"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Cover URL</label>
              <input className="form-input" type="url" placeholder="https://..." value={form.cover_url} onChange={(e) => set("cover_url", e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Download Link *</label>
              <input className="form-input" type="url" placeholder="https://..." value={form.download_link} onChange={(e) => set("download_link", e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Screenshots (1 URL per baris)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder={"https://...\nhttps://..."}
                value={form.screenshots_input}
                onChange={(e) => set("screenshots_input", e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editGame, setEditGame] = useState<Game | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<{ email?: string | null } | null>(null);

  useEffect(() => {
    checkAuth();
    fetchGames();
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      navigate("/admin/login");
    } else {
      setUser(data.user);
    }
  };

  const fetchGames = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setGames(data as Game[]);
    setLoading(false);
  };

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const handleSave = async (payload: Omit<Game, "id" | "created_at">) => {
    setSaving(true);
    let error;
    if (editGame) {
      const res = await supabase.from("games").update(payload).eq("id", editGame.id);
      error = res.error;
    } else {
      const res = await supabase.from("games").insert([payload]);
      error = res.error;
    }

    if (error) {
      addToast("Gagal menyimpan: " + error.message, "error");
    } else {
      addToast(editGame ? "Game diperbarui!" : "Game ditambahkan!", "success");
      setModalOpen(false);
      setEditGame(null);
      await fetchGames();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("games").delete().eq("id", id);
    if (error) {
      addToast("Gagal menghapus: " + error.message, "error");
    } else {
      addToast("Game dihapus.", "success");
      await fetchGames();
    }
    setDeleteId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const filtered = games.filter((g) =>
    !search || g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">CDMonza</div>
          <div className="admin-sidebar-badge">Admin</div>
        </div>
        <nav className="admin-sidebar-nav">
          <button className="admin-nav-item active">
            🎮 Games
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <div style={{ fontSize: 12, color: "var(--gray-muted)", fontFamily: "var(--font-mono)", marginBottom: 10, wordBreak: "break-all" }}>
            {user?.email}
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ width: "100%", justifyContent: "center" }}>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar-title">Dashboard</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setEditGame(null); setModalOpen(true); }}
          >
            + Tambah Game
          </button>
        </div>

        <div className="admin-content">
          {/* Stats */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-label">Total Game</div>
              <div className="admin-stat-value">{games.length}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">PSP</div>
              <div className="admin-stat-value">{games.filter((g) => g.platform === "PSP").length}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">PS2</div>
              <div className="admin-stat-value">{games.filter((g) => g.platform === "PS2").length}</div>
            </div>
          </div>

          {/* Games Table */}
          <div className="table-wrap">
            <div className="table-header">
              <span className="table-title">Daftar Game</span>
              <div className="search-wrap" style={{ width: 240 }}>
                <span className="search-icon">⌕</span>
                <input
                  className="search-input"
                  placeholder="Cari game..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--gray-text)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
                Memuat data...
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: 60 }}>
                <div className="empty-state-icon">🎮</div>
                <h3 style={{ fontSize: 22 }}>Belum Ada Game</h3>
                <p>Tambahkan game pertama dengan tombol di atas.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Nama</th>
                    <th>Platform</th>
                    <th>Genre</th>
                    <th>Ukuran</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((g) => (
                    <tr key={g.id}>
                      <td>
                        {g.cover_url ? (
                          <img src={g.cover_url} alt={g.name} className="table-cover" />
                        ) : (
                          <div className="table-cover-placeholder">🎮</div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--white)" }}>{g.name}</td>
                      <td>
                        <Tag label={g.platform} variant="platform" />
                      </td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {(g.genres || []).slice(0, 2).map((genre) => (
                            <Tag key={genre} label={genre} variant="genre" />
                          ))}
                        </div>
                      </td>
                      <td>
                        <Tag label={g.file_size} variant="size" />
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => { setEditGame(g); setModalOpen(true); }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setDeleteId(g.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <GameFormModal
          initial={editGame}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditGame(null); }}
          saving={saving}
        />
      )}

      {/* Confirm Delete */}
      {deleteId && (
        <ConfirmDialog
          message={`Hapus game "${games.find((g) => g.id === deleteId)?.name}"? Tindakan ini tidak bisa dibatalkan.`}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Toasts */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" ? "✓" : "✕"} {t.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
