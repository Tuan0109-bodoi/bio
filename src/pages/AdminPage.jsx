import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/admin.css';

const SESSION_KEY = 'admin_authed';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const loadProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) loadProfiles();
  }, [authed]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!ADMIN_PASSWORD) {
      setAuthError('Chưa cấu hình VITE_ADMIN_PASSWORD trong .env.');
      return;
    }
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Sai mật khẩu.');
    }
  };

  const updateStatus = async (id, status) => {
    setActionError('');
    const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
    if (error) {
      setActionError('Cập nhật thất bại: ' + error.message);
      return;
    }
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  if (!authed) {
    return (
      <div className="admin-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <h1>Admin</h1>
          <label>
            Mật khẩu
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
            />
          </label>
          {authError && <p className="admin-error">{authError}</p>}
          <button type="submit">Đăng nhập</button>
        </form>
      </div>
    );
  }

  const pending = profiles.filter((p) => p.status === 'pending');
  const others = profiles.filter((p) => p.status !== 'pending');

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Duyệt trang bio</h1>
        {loading && <p>Đang tải...</p>}
        {actionError && <p className="admin-error">{actionError}</p>}

        <h2>Chờ duyệt ({pending.length})</h2>
        {pending.length === 0 && <p className="admin-hint">Không có gì đang chờ.</p>}
        <div className="admin-list">
          {pending.map((p) => (
            <div className="admin-row" key={p.id}>
              {p.avatar_url && <img className="admin-avatar" src={p.avatar_url} alt={p.display_name} />}
              <div className="admin-info">
                <div className="admin-name">{p.display_name} <span className="admin-username">@{p.username}</span></div>
                <div className="admin-bio">{p.bio_text}</div>
              </div>
              <div className="admin-actions">
                <button className="approve-btn" onClick={() => updateStatus(p.id, 'approved')}>Duyệt</button>
                <button className="reject-btn" onClick={() => updateStatus(p.id, 'rejected')}>Từ chối</button>
              </div>
            </div>
          ))}
        </div>

        <h2>Đã xử lý ({others.length})</h2>
        <div className="admin-list">
          {others.map((p) => (
            <div className="admin-row" key={p.id}>
              {p.avatar_url && <img className="admin-avatar" src={p.avatar_url} alt={p.display_name} />}
              <div className="admin-info">
                <div className="admin-name">{p.display_name} <span className="admin-username">@{p.username}</span></div>
                <span className={`admin-status admin-status-${p.status}`}>{p.status}</span>
              </div>
              <div className="admin-actions">
                {p.status !== 'approved' && (
                  <button className="approve-btn" onClick={() => updateStatus(p.id, 'approved')}>Duyệt</button>
                )}
                {p.status !== 'rejected' && (
                  <button className="reject-btn" onClick={() => updateStatus(p.id, 'rejected')}>Từ chối</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
