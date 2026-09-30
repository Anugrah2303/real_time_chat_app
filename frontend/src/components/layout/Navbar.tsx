import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, MessageCircle, Shield, UserCog, X } from "lucide-react";
import Avatar from "../common/Avatar";
import Badge from "../ui/Badge";
import NotificationBell from "../notification/NotificationBell";
import ProfileModal from "../profile/ProfileModal";
import { useAuth } from "../../context/AuthContext";
import useClickOutside from "../../hooks/useClickOutside";
import { UserRole } from "../../types";
import { APP_NAME } from "../../utils/constants";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const isAdmin = user?.role === UserRole.ADMIN;

  const handleLogout = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const openProfile = () => {
    setMenuOpen(false);
    setMobileOpen(false);
    setProfileOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="container-page flex h-full items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <MessageCircle size={20} />
          </span>
          <span className="font-display text-xl font-bold text-ink-900">{APP_NAME}</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-1 sm:gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 md:flex"
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
            <NotificationBell />
            <div ref={menuRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl p-1.5 pr-3 hover:bg-ink-50"
              >
                <Avatar name={user.name} src={user.profileImage} size="sm" />
                <span className="max-w-[8rem] truncate text-sm font-medium text-ink-900">{user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-pop">
                  <div className="border-b border-ink-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                    <p className="truncate text-xs text-ink-500">{user.email}</p>
                    <div className="mt-2">
                      <Badge tone={isAdmin ? "blue" : "gray"}>{user.role}</Badge>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openProfile}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <UserCog size={16} />
                    Edit profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="rounded-xl p-2 text-ink-700 hover:bg-ink-50 md:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>

      {user && mobileOpen && (
        <div className="border-b border-ink-100 bg-white shadow-pop md:hidden">
          <div className="container-page space-y-1 py-3">
            <div className="flex items-center gap-3 px-2 pb-3">
              <Avatar name={user.name} src={user.profileImage} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">{user.name}</p>
                <p className="truncate text-xs text-ink-500">{user.role}</p>
              </div>
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
            <button
              type="button"
              onClick={openProfile}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-ink-700 hover:bg-ink-50"
            >
              <UserCog size={16} />
              Edit profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}

      {user && <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />}
    </header>
  );
};

export default Navbar;
