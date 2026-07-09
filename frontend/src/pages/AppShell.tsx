import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Logo } from "../components/Logo";
import { Icon } from "../components/Icon";
import { modulesForRole } from "../modules/registry";
import "./shell.css";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  tenant_admin: "Tenant Admin",
  auditor: "Auditor",
};

export default function AppShell() {
  const { user, tenant, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const isSuper = user.role === "super_admin";
  const isAdmin = isSuper || user.role === "tenant_admin";
  // Super admin has no tenant data, so modules don't apply — stats + user mgmt only.
  const modules = isSuper ? [] : modulesForRole(user.role);

  return (
    <div className="shell">
      <aside className="shell-side">
        <div className="shell-logo">
          <Logo size={30} />
        </div>

        <div className="shell-context">
          <span className="shell-context-label">
            {isSuper ? "Platform" : "Workspace"}
          </span>
          <strong>{tenant?.name ?? "Cap Corporate"}</strong>
        </div>

        <nav className="shell-nav">
          <NavLink to="/app" end className="shell-link">
            <Icon name={isSuper ? "trending-up" : "dashboard"} size={19} />
            {isSuper ? "Overview" : "Dashboard"}
          </NavLink>

          {isAdmin && (
            <NavLink to="/app/admin" className="shell-link">
              <Icon name="users" size={19} />
              {isSuper ? "User Management" : "Team & Users"}
            </NavLink>
          )}

          {!isSuper && (
            <>
              <div className="shell-nav-heading">Modules</div>
              {modules.length === 0 && (
                <span className="shell-empty">No modules installed yet</span>
              )}
              {modules.map((m) => (
                <NavLink
                  key={m.slug}
                  to={`/app/m/${m.slug}`}
                  className="shell-link"
                >
                  <Icon name={m.icon} size={19} />
                  {m.title}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="shell-user">
          <div className="shell-avatar">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="shell-user-meta">
            <strong>{user.full_name}</strong>
            <span>{ROLE_LABEL[user.role]}</span>
          </div>
          <button
            className="shell-logout"
            title="Sign out"
            aria-label="Sign out"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </aside>

      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}
