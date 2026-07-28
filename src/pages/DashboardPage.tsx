import React from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RoleBadge } from '../components/RoleBadge';
import { useAuth } from '../auth/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import type { UserRole } from '../types/auth.types';

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__info">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
        {trend && <p className="stat-card__trend">{trend}</p>}
      </div>
    </div>
  );
}

// ─── Permission Action Row ────────────────────────────────────────────────────

interface ActionRowProps {
  label: string;
  allowed: boolean;
}

function ActionRow({ label, allowed }: ActionRowProps) {
  return (
    <div className="perm-row">
      <span className="perm-row__label">{label}</span>
      <span className={`perm-row__status ${allowed ? 'perm-row__status--allowed' : 'perm-row__status--denied'}`}>
        {allowed ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Allowed
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            Restricted
          </>
        )}
      </span>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const { profile, role } = useAuth();
  const { canCreate, canEdit, canDelete, canRead, isAdmin } = usePermissions();

  return (
    <AppLayout>
      <div className="dashboard">
        {/* ── Welcome header ── */}
        <section className="dashboard__header" aria-labelledby="dashboard-title">
          <div className="dashboard__title-group">
            <h1 id="dashboard-title" className="dashboard__title">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
            </h1>
            <p className="dashboard__subtitle">
              Here's your system overview.
            </p>
          </div>
          {role && <RoleBadge role={role as UserRole} className="dashboard__role" />}
        </section>

        {/* ── Stats row ── */}
        <section className="dashboard__stats" aria-label="Statistics">
          <StatCard
            label="Total Users"
            value="—"
            trend="Connect data source"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <StatCard
            label="Records"
            value="—"
            trend="Connect data source"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            }
          />
          <StatCard
            label="Active Sessions"
            value="1"
            trend="Current session"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
          />
        </section>

        {/* ── Role info + permissions demo ── */}
        <div className="dashboard__grid">
          {/* Session info */}
          <Card elevation="raised" className="dashboard__card">
            <Card.Header>
              <h2 className="card-section__title">Session Info</h2>
            </Card.Header>
            <Card.Body>
              <dl className="info-list">
                <div className="info-list__row">
                  <dt className="info-list__label">Email</dt>
                  <dd className="info-list__value">{profile?.email ?? '—'}</dd>
                </div>
                <div className="info-list__row">
                  <dt className="info-list__label">Full Name</dt>
                  <dd className="info-list__value">{profile?.full_name ?? 'Not set'}</dd>
                </div>
                <div className="info-list__row">
                  <dt className="info-list__label">Role</dt>
                  <dd className="info-list__value">
                    {role ? <RoleBadge role={role as UserRole} /> : '—'}
                  </dd>
                </div>
                <div className="info-list__row">
                  <dt className="info-list__label">User ID</dt>
                  <dd className="info-list__value info-list__value--mono">{profile?.id ?? '—'}</dd>
                </div>
              </dl>
            </Card.Body>
          </Card>

          {/* Permissions */}
          <Card elevation="raised" className="dashboard__card">
            <Card.Header>
              <h2 className="card-section__title">Your Permissions</h2>
              <p className="card-section__subtitle">
                {isAdmin
                  ? 'You have full administrative access.'
                  : 'You have read-only access to this system.'}
              </p>
            </Card.Header>
            <Card.Body>
              <div className="perm-list">
                <ActionRow label="Read data" allowed={canRead} />
                <ActionRow label="Create records" allowed={canCreate} />
                <ActionRow label="Edit records" allowed={canEdit} />
                <ActionRow label="Delete records" allowed={canDelete} />
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions (admin-gated demo) */}
          <Card elevation="raised" className="dashboard__card dashboard__card--wide">
            <Card.Header>
              <h2 className="card-section__title">Quick Actions</h2>
              <p className="card-section__subtitle">
                Actions are enabled or disabled based on your role.
              </p>
            </Card.Header>
            <Card.Body>
              <div className="action-grid">
                <Button
                  id="btn-new-record"
                  variant="primary"
                  size="md"
                  disabled={!canCreate}
                  title={!canCreate ? 'Admin access required' : undefined}
                >
                  + New Record
                </Button>
                <Button
                  id="btn-edit-record"
                  variant="secondary"
                  size="md"
                  disabled={!canEdit}
                  title={!canEdit ? 'Admin access required' : undefined}
                >
                  Edit Record
                </Button>
                <Button
                  id="btn-delete-record"
                  variant="danger"
                  size="md"
                  disabled={!canDelete}
                  title={!canDelete ? 'Admin access required' : undefined}
                >
                  Delete Record
                </Button>
                <Button
                  id="btn-view-report"
                  variant="ghost"
                  size="md"
                  disabled={!canRead}
                >
                  View Report
                </Button>
              </div>
              {!isAdmin && (
                <p className="action-grid__notice" role="status">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25" />
                    <path d="M7 4v3.5M7 9.5h.01" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </svg>
                  Write actions are restricted to administrators.
                </p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
