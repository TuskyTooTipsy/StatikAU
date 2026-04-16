import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] items-center justify-center py-16">
      <div className="panel max-w-2xl p-8 text-center md:p-10">
        <p className="eyebrow">404</p>
        <h1 className="headline-md mt-3">This page stepped out of frame.</h1>
        <p className="body-muted mt-4">
          Head back to the featured drop, the shop, or the lookbook to get back into the STATIK world.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary h-11 px-5 text-xs">Go home</Link>
          <Link to="/shop" className="btn-secondary h-11 px-5 text-xs">Open the shop</Link>
        </div>
      </div>
    </div>
  );
}
