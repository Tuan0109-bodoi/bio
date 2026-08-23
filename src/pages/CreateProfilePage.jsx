import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/create-profile.css';

const SLUG_PATTERN = /^[a-z0-9-]+$/;

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'discord', label: 'Discord' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'other', label: 'Khác' },
];

const initialForm = {
  username: '',
  displayName: '',
  bioText: '',
  songTitle: '',
  location: '',
  audioLinkUrl: '',
};

async function uploadFile(bucket, username, file) {
  const ext = file.name.split('.').pop();
  const path = `${username}-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export default function CreateProfilePage() {
  const [form, setForm] = useState(initialForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [audioSource, setAudioSource] = useState('link'); // 'link' | 'file'
  const [audioFile, setAudioFile] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successUsername, setSuccessUsername] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const addSocialLink = () => {
    setSocialLinks((prev) => [...prev, { icon: 'instagram', href: '' }]);
  };

  const updateSocialLink = (index, patch) => {
    setSocialLinks((prev) => prev.map((link, i) => (i === index ? { ...link, ...patch } : link)));
  };

  const removeSocialLink = (index) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const username = form.username.trim().toLowerCase();
    if (!SLUG_PATTERN.test(username)) {
      setError('Username chỉ được chứa chữ thường, số và dấu gạch ngang (-).');
      return;
    }
    if (!form.displayName.trim()) {
      setError('Vui lòng nhập tên hiển thị.');
      return;
    }
    const emptyLink = socialLinks.find((link) => !link.href.trim());
    if (emptyLink) {
      setError('Vui lòng nhập link cho mục mạng xã hội đã thêm, hoặc xoá bớt mục trống.');
      return;
    }

    setSubmitting(true);
    try {
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existing) {
        setError('Username này đã có người dùng, vui lòng chọn tên khác.');
        setSubmitting(false);
        return;
      }

      let avatarUrl = '';
      if (avatarFile) {
        avatarUrl = await uploadFile('avatars', username, avatarFile);
      }

      let videoUrl = '';
      if (videoFile) {
        videoUrl = await uploadFile('videos', username, videoFile);
      }

      let audioUrl = '';
      if (audioSource === 'file' && audioFile) {
        audioUrl = await uploadFile('audio', username, audioFile);
      } else if (audioSource === 'link' && form.audioLinkUrl.trim()) {
        audioUrl = form.audioLinkUrl.trim();
      }

      const cleanedLinks = socialLinks.map((link) => ({
        icon: link.icon,
        href: link.href.trim(),
        label: PLATFORM_OPTIONS.find((p) => p.value === link.icon)?.label || link.icon,
      }));

      const { error: insertError } = await supabase.from('profiles').insert({
        username,
        display_name: form.displayName.trim(),
        bio_text: form.bioText.trim(),
        song_title: form.songTitle.trim(),
        location: form.location.trim(),
        avatar_url: avatarUrl,
        video_url: videoUrl,
        audio_url: audioUrl,
        social_links: cleanedLinks,
        status: 'pending',
      });

      if (insertError) {
        setError('Gửi dữ liệu thất bại: ' + insertError.message);
        setSubmitting(false);
        return;
      }

      setSuccessUsername(username);
    } catch (err) {
      setError('Đã có lỗi xảy ra: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (successUsername) {
    return (
      <div className="create-page">
        <div className="create-card">
          <h1>Đã gửi thành công!</h1>
          <p>
            Thông tin của bạn đang chờ duyệt. Sau khi được duyệt, trang của bạn
            sẽ xuất hiện tại:
          </p>
          <span className="create-link">
            {window.location.origin}/{successUsername}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="create-page">
      <form className="create-card" onSubmit={handleSubmit}>
        <h1>Tạo trang bio của bạn</h1>

        <label>
          Username (dùng cho link, vd: hoangkhanh)
          <input
            type="text"
            value={form.username}
            onChange={handleChange('username')}
            placeholder="hoangkhanh"
            required
          />
        </label>

        <label>
          Tên hiển thị
          <input
            type="text"
            value={form.displayName}
            onChange={handleChange('displayName')}
            placeholder="Hoang Khanh"
            required
          />
        </label>

        <label>
          Bio ngắn
          <textarea
            value={form.bioText}
            onChange={handleChange('bioText')}
            placeholder="Vài dòng giới thiệu..."
            rows={3}
          />
        </label>

        <label>
          Tên bài hát nền
          <input
            type="text"
            value={form.songTitle}
            onChange={handleChange('songTitle')}
            placeholder="Baby Doll"
          />
        </label>

        <fieldset>
          <legend>Nhạc nền</legend>

          <div className="audio-source-toggle">
            <label className="radio-option">
              <input
                type="radio"
                name="audioSource"
                checked={audioSource === 'link'}
                onChange={() => setAudioSource('link')}
              />
              Nhập link bài hát
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="audioSource"
                checked={audioSource === 'file'}
                onChange={() => setAudioSource('file')}
              />
              Upload file (mp3/mp4)
            </label>
          </div>

          {audioSource === 'link' ? (
            <label>
              Link bài hát
              <input
                type="url"
                value={form.audioLinkUrl}
                onChange={handleChange('audioLinkUrl')}
                placeholder="https://..."
              />
            </label>
          ) : (
            <label>
              File nhạc (mp3 hoặc mp4 — nếu là mp4 chỉ lấy phần tiếng)
              <input
                type="file"
                accept="audio/*,video/mp4"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              />
            </label>
          )}
        </fieldset>

        <label>
          Vị trí
          <input
            type="text"
            value={form.location}
            onChange={handleChange('location')}
            placeholder="Ho Chi Minh City"
          />
        </label>

        <label>
          Ảnh đại diện
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          />
        </label>

        <label>
          Video nền (tuỳ chọn)
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
        </label>

        <fieldset>
          <legend>Mạng xã hội (tuỳ chọn — thêm bao nhiêu tuỳ bạn)</legend>

          {socialLinks.length === 0 && (
            <p className="create-hint">Chưa có mục nào. Bấm "+ Thêm liên kết" nếu bạn muốn hiển thị link mạng xã hội.</p>
          )}

          {socialLinks.map((link, index) => (
            <div className="social-link-row" key={index}>
              <select
                value={link.icon}
                onChange={(e) => updateSocialLink(index, { icon: e.target.value })}
              >
                {PLATFORM_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input
                type="url"
                value={link.href}
                onChange={(e) => updateSocialLink(index, { href: e.target.value })}
                placeholder="https://..."
              />
              <button
                type="button"
                className="remove-link-btn"
                onClick={() => removeSocialLink(index)}
                aria-label="Xoá mục này"
              >
                ✕
              </button>
            </div>
          ))}

          <button type="button" className="add-link-btn" onClick={addSocialLink}>
            + Thêm liên kết
          </button>
        </fieldset>

        {error && <p className="create-error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi...' : 'Tạo trang'}
        </button>
      </form>
    </div>
  );
}
