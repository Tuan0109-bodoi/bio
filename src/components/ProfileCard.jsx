import '../styles/profile.css';
import '../styles/tilt-glow.css';
import TiltGlowCard from './TiltGlowCard';
import {
  DiscordLogo,
  FacebookLogo,
  InstagramLogo,
  GameController,
  TiktokLogo,
  Sparkle,
  Eye,
  MapPin,
  UserCircle,
} from '@phosphor-icons/react';

const SOCIAL_LINKS = [
  { icon: Sparkle, href: '#', label: 'Special' },
  { icon: FacebookLogo, href: '#', label: 'Facebook' },
  { icon: DiscordLogo, href: '#', label: 'Discord' },
  { icon: GameController, href: '#', label: 'Gaming' },
  { icon: TiktokLogo, href: '#', label: 'TikTok' },
  { icon: Sparkle, href: '#', label: 'Other' },
];

export default function ProfileCard() {
  return (
      <TiltGlowCard className="profile-card-wrapper">
        <div className="profile-card glass">
        {/* Header */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            <div className="avatar-glow" />
            <img
              className="avatar"
              src="/assets/anh_chinh.jpg"
              alt="Thư Minh"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%231a1a2e" width="80" height="80"/><text x="40" y="45" text-anchor="middle" fill="%23e8a0bf" font-size="24">TM</text></svg>';
              }}
            />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">
              Thư Minh
              <span className="hearts">💜 🌟</span>
            </h1>
            <p className="profile-bio">
              Ghét em thì được chứ sao quên được e
            </p>
          </div>
        </div>

        {/* Friends */}
        <div className="friends-row">
          <div className="friend-card">
            <img
              className="friend-avatar"
              src="/assets/anh_phu.jpg"
              alt="omachii0"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect fill="%231a1a2e" width="36" height="36" rx="18"/><text x="18" y="22" text-anchor="middle" fill="%23aaa" font-size="12">O</text></svg>';
              }}
            />
            <div className="friend-info">
              <div className="friend-name">omachii0</div>
              <div className="friend-status">last seen 13 hours ago</div>
            </div>
          </div>

          <div className="friend-card">
            <img
              className="friend-avatar"
              src="/assets/anh_phu.jpg"
              alt="Xii"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect fill="%231a1a2e" width="36" height="36" rx="18"/><text x="18" y="22" text-anchor="middle" fill="%23aaa" font-size="12">X</text></svg>';
              }}
            />
            <div className="friend-meta">
              <div className="friend-name">Xii</div>
              <div className="friend-stats">
                <span><UserCircle size={10} weight="fill" style={{ marginRight: 2, verticalAlign: 'middle' }} />12 Friends</span>
                <span>👥 0 Followers</span>
              </div>
              <button className="view-profile-btn">View Profile</button>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="social-icons">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              className="social-icon"
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon size={20} weight="fill" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="profile-footer">
          <div className="view-count">
            <Eye size={14} />
            <span>218</span>
          </div>
          <div className="location">
            <MapPin size={14} weight="fill" />
            <span>Ho Chi Minh City</span>
          </div>
        </div>
        </div>
      </TiltGlowCard>
  );
}

