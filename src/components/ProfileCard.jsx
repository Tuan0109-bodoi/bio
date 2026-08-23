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
} from '@phosphor-icons/react';

const ICONS_BY_KEY = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  discord: DiscordLogo,
  gaming: GameController,
  tiktok: TiktokLogo,
  other: Sparkle,
};

const DEFAULT_SOCIAL_LINKS = [
  { icon: 'instagram', href: '#', label: 'Instagram' },
  { icon: 'facebook', href: '#', label: 'Facebook' },
  { icon: 'discord', href: '#', label: 'Discord' },
  { icon: 'tiktok', href: '#', label: 'TikTok' },
];

function initialsFrom(name) {
  if (!name) return '?';
  return name.trim().slice(0, 2).toUpperCase();
}

export default function ProfileCard({ profile }) {
  const {
    display_name: displayName,
    bio_text: bioText,
    avatar_url: avatarUrl,
    view_count: viewCount = 0,
    location = '',
    social_links: socialLinks,
    friends,
  } = profile;

  const links = socialLinks?.length ? socialLinks : DEFAULT_SOCIAL_LINKS;
  const initials = initialsFrom(displayName);

  return (
      <TiltGlowCard className="profile-card-wrapper">
        <div className="profile-card glass">
        {/* Header */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            <div className="avatar-glow" />
            <img
              className="avatar"
              src={avatarUrl || '/assets/anh_chinh.jpg'}
              alt={displayName}
              onError={(e) => {
                e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect fill="%231a1a2e" width="80" height="80"/><text x="40" y="45" text-anchor="middle" fill="%23e8a0bf" font-size="24">${initials}</text></svg>`;
              }}
            />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">
              {displayName}
              <span className="hearts">💜 🌟</span>
            </h1>
            <p className="profile-bio">
              {bioText}
            </p>
          </div>
        </div>

        {/* Friends */}
        {friends?.length > 0 && (
          <div className="friends-row">
            {friends.map((friend) => (
              <div className="friend-card" key={friend.name}>
                <img
                  className="friend-avatar"
                  src={friend.avatarUrl || '/assets/anh_phu.jpg'}
                  alt={friend.name}
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><rect fill="%231a1a2e" width="36" height="36" rx="18"/><text x="18" y="22" text-anchor="middle" fill="%23aaa" font-size="12">${initialsFrom(friend.name).slice(0, 1)}</text></svg>`;
                  }}
                />
                <div className="friend-info">
                  <div className="friend-name">{friend.name}</div>
                  {friend.status && <div className="friend-status">{friend.status}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Social Icons */}
        <div className="social-icons">
          {links.map(({ icon, href, label }) => {
            const Icon = ICONS_BY_KEY[icon] || Sparkle;
            return (
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
            );
          })}
        </div>

        {/* Footer */}
        <div className="profile-footer">
          <div className="view-count">
            <Eye size={14} />
            <span>{viewCount}</span>
          </div>
          {location && (
            <div className="location">
              <MapPin size={14} weight="fill" />
              <span>{location}</span>
            </div>
          )}
        </div>
        </div>
      </TiltGlowCard>
  );
}
