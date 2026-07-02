'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiBox, FiShoppingBag, FiUsers, FiLogOut, FiSettings, FiPlus, FiTrash2, FiMove, FiSearch, FiSave, FiMail } from 'react-icons/fi';
import { useAdminAuth, getAdminToken, adminLogout } from '@/app/lib/admin-auth';

interface CarouselProduct {
  product: {
    _id: string;
    name: string;
    mainImage: string;
    images?: {url: string}[] | string[];
    price: number;
    discountedPrice?: number;
    slug?: string;
  };
}

export default function StorefrontSettings() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  
  // Hero Products State
  const [heroProducts, setHeroProducts] = useState<CarouselProduct[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Product Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchSettings();
    }
  }, [authLoading, isAuthenticated]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHeroProducts(data.heroProducts || []);
      }
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout(router);
  };

  const searchProducts = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.products || data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  const addProductToCarousel = (product: any) => {
    // Check if already in products list
    if (heroProducts.some(p => p.product._id === product._id)) {
      return;
    }

    setHeroProducts([...heroProducts, { product }]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeProductFromCarousel = (productId: string) => {
    setHeroProducts(heroProducts.filter(p => p.product._id !== productId));
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = getAdminToken();
      const payloadProducts = heroProducts.map(p => ({ product: p.product._id }));

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ heroProducts: payloadProducts })
      });
      
      if (res.ok) {
        setSuccess('Homepage Hero Carousel saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('draggedIndex', index.toString());
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    const draggedIndexStr = e.dataTransfer.getData('draggedIndex');
    if (!draggedIndexStr) return;
    const draggedIndex = parseInt(draggedIndexStr, 10);
    
    if (draggedIndex === targetIndex) return;

    const newProducts = [...heroProducts];
    const [draggedItem] = newProducts.splice(draggedIndex, 1);
    newProducts.splice(targetIndex, 0, draggedItem);
    setHeroProducts(newProducts);
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex text-gray-900">
      {/* Sidebar - EXACT COPY OF THE ORIGINAL LAYOUT */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-800">
          <img src="/logoo1.png" alt="Logo" className="h-20 mx-auto" />
        </div>
        
        <nav className="mt-6">
          <Link href="/admin/dashboard" className="block py-3 px-4 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900">
            <div className="flex items-center">
              <FiBox className="mr-3" /> Dashboard
            </div>
          </Link>
          <Link href="/admin/products" className="block py-3 px-4 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900">
            <div className="flex items-center">
              <FiBox className="mr-3" /> Products
            </div>
          </Link>
          <Link href="/admin/orders" className="block py-3 px-4 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900">
            <div className="flex items-center">
              <FiShoppingBag className="mr-3" /> Orders
            </div>
          </Link>
          <Link href="/admin/users" className="block py-3 px-4 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900">
            <div className="flex items-center">
              <FiUsers className="mr-3" /> Users
            </div>
          </Link>
          <Link href="/admin/contacts" className="block py-3 px-4 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900">
            <div className="flex items-center">
              <FiMail className="mr-3" /> Contacts
            </div>
          </Link>
          <Link href="/admin/storefront" className="block py-3 px-4 text-gray-900 font-medium bg-gray-100 hover:bg-gray-200 border-l-4 border-blue-600">
            <div className="flex items-center">
              <FiSettings className="mr-3 text-blue-600" /> Storefront
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full text-left py-3 px-4 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900"
          >
            <div className="flex items-center">
              <FiLogOut className="mr-3" /> Logout
            </div>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Storefront Hero Banner</h1>
            <p className="text-gray-600">Manage the sliding banner products shown at the very top of your homepage.</p>
          </div>
          <button 
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 flex items-center transition duration-150"
          >
            <FiSave className="mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r shadow-sm">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r shadow-sm">{success}</div>}

        <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Banner Products List</h2>
          <p className="text-sm text-gray-500 mb-6">Search and add products to show on the top banner, then drag and drop to reorder.</p>

          {/* Product Search */}
          <div className="mb-8 relative">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products to add..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={searchTerm}
                onChange={searchProducts}
              />
            </div>
            
            {/* Search Results Dropdown */}
            {searchTerm.length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searching ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                ) : (
                  searchResults.map(product => (
                    <div 
                      key={product._id}
                      onClick={() => addProductToCarousel(product)}
                      className="p-3 hover:bg-gray-550 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center">
                        <img 
                          src={product.mainImage || '/perfume-placeholder.jpg'} 
                          alt={product.name} 
                          className="w-8 h-8 object-cover rounded mr-3"
                        />
                        <div>
                          <div className="font-semibold text-sm text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">₹{product.price}</div>
                        </div>
                      </div>
                      <span className="text-xs text-blue-600 font-semibold px-2.5 py-1 bg-blue-50 rounded-full">Add</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Products List */}
          <div className="space-y-3">
            {heroProducts.length === 0 ? (
              <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                No products added yet. Use the search bar above to select products to feature on your top banner.
              </div>
            ) : (
              heroProducts.map((p, index) => (
                <div 
                  key={p.product._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, index)}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between cursor-move hover:bg-gray-100/50 transition group"
                >
                  <div className="flex items-center">
                    <FiMove className="text-gray-400 mr-4 cursor-grab group-hover:text-gray-600 transition" />
                    <span className="text-sm font-semibold text-gray-500 mr-4 font-mono">{index + 1}.</span>
                    <img 
                      src={p.product.mainImage || '/perfume-placeholder.jpg'} 
                      alt={p.product.name} 
                      className="w-12 h-12 object-cover rounded mr-4 border border-gray-200"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{p.product.name}</div>
                      <div className="text-sm text-gray-500">₹{p.product.price}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeProductFromCarousel(p.product._id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
