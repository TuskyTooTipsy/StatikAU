import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import { networkApi } from '../api/network';
import ProductCard from '../components/ProductCard';
import EmptyPanel from '../components/EmptyPanel';
import type { Product } from '../types/catalog';
import type { PublicPlatformPayload } from '../types/network';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [publicData, setPublicData] = useState<PublicPlatformPayload | null>(null);

  useEffect(() => {
    networkApi.getPublicPlatform().then(setPublicData).catch(() => undefined);
    fetchProducts().then(setProducts).catch(() => undefined);
  }, []);

  if (publicData?.site.shopLocked !== false) {
    return (
      <div className="shell py-12">
        <EmptyPanel eyebrow="Shop" title="Shop access is locked by admin" body="Commerce is intentionally secondary in this build. The shop only becomes public when admins explicitly unlock it." />
      </div>
    );
  }

  return (
    <div className="shell space-y-8 py-12">
      <div className="page-hero-cut p-6 md:p-8">
        <p className="eyebrow">Shop</p>
        <h1 className="headline-lg mt-3">Secondary by design.</h1>
        <p className="body-muted mt-4">The shop stays behind the culture layer. It only comes forward when it is actually ready to be live.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </div>
  );
}
