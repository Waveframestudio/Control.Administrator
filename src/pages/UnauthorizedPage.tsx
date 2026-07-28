import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

/**
 * UnauthorizedPage — shown when an authenticated user tries to access
 * a route they don't have permission for (e.g., a viewer hitting an admin route).
 */
export function UnauthorizedPage() {
  return (
    <div className="error-page">
      <div className="error-page__content">
        <div className="error-page__code">403</div>
        <h1 className="error-page__title">Access Restricted</h1>
        <p className="error-page__message">
          You don't have permission to view this page.
          Contact your administrator to request elevated access.
        </p>
        <Link to="/dashboard">
          <Button id="btn-back-dashboard" variant="primary" size="md">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
