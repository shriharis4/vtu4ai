import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
      <p className="font-mono text-6xl font-bold text-gradient">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">
        That page doesn’t exist. Let’s get you back to solving.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <Home size={18} aria-hidden="true" />
        Back home
      </Link>
    </section>
  );
}
