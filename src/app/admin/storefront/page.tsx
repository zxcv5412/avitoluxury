'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiBox, FiShoppingBag, FiUsers, FiLogOut, FiSettings, FiLayout, FiPlus, FiTrash2, FiMove, FiSearch, FiSave, FiMail } from 'react-icons/fi';
import { useAdminAuth, getAdminToken } from '@/app/lib/admin-auth';

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

interface CarouselConfig {
  id: string;
  title: string;
  products: CarouselProduct[];
}

export default function StorefrontSettings() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [carousels, setCarousels] = useState<CarouselConfig[]>([]);
  const [selectedCarouselId, setSelectedCarouselId] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Product Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // New Carousel State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newId, setNewId] = useState('');
  const [newTitle, setNewTitle] = useState('');

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
        setCarousels(data.carousels || []);
        if (data.carousels && data.carousels.length > 0) {
          setSelectedCarouselId(data.carousels[0].id);
        }
      }
    } catch (err) {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
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
      const res = await fetch(`/api/products?search=${encodeURIComponent(val)}`);
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

  const activeCarousel = carousels.find(c => c.id === selectedCarouselId);

  const addProductToCarousel = (product: any) => {
    if (!activeCarousel) return;
    
    // Check if already in carousel
    if (activeCarousel.products.some(p => p.product._id === product._id)) {
      return;
    }

    const updatedCarousels = carousels.map(c => {
      if (c.id === selectedCarouselId) {
        return {
          ...c,
          products: [...c.products, { product }]
        };
      }
      return c;
    });
    setCarousels(updatedCarousels);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeProductFromCarousel = (productId: string) => {
    const updatedCarousels = carousels.map(c => {
      if (c.id === selectedCarouselId) {
        return {
          ...c,
          products: c.products.filter(p => p.product._id !== productId)
        };
      }
      return c;
    });
    setCarousels(updatedCarousels);
  };

  const createCarousel = () => {
    if (!newId || !newTitle) return;
    const formattedId = newId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    if (carousels.some(c => c.id === formattedId)) {
      alert('A carousel with this ID already exists');
      return;
    }

    const newCarousel: CarouselConfig = {
      id: formattedId,
      title: newTitle,
      products: []
    };

    setCarousels([...carousels, newCarousel]);
    setSelectedCarouselId(formattedId);
    setShowNewModal(false);
    setNewId('');
    setNewTitle('');
  };

  const deleteCarousel = (id: string) => {
    if (confirm('Are you sure you want to delete this carousel?')) {
      const updated = carousels.filter(c => c.id !== id);
      setCarousels(updated);
      if (selectedCarouselId === id) {
        setSelectedCarouselId(updated.length > 0 ? updated[0].id : '');
      }
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = getAdminToken();
      // Format payload: only send ObjectIds for products
      const payloadCarousels = carousels.map(c => ({
        id: c.id,
        title: c.title,
        products: c.products.map(p => ({ product: p.product._id }))
      }));

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ carousels: payloadCarousels })
      });
      
      if (res.ok) {
        setSuccess('Storefront settings saved successfully!');
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
    
    if (draggedIndex === targetIndex || !activeCarousel) return;

    const newProducts = [...activeCarousel.products];
    const [draggedItem] = newProducts.splice(draggedIndex, 1);
    newProducts.splice(targetIndex, 0, draggedItem);

    const updatedCarousels = carousels.map(c => {
      if (c.id === selectedCarouselId) {
        return { ...c, products: newProducts };
      }
      return c;
    });
    setCarousels(updatedCarousels);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 tracking-wider">A V I T O</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 py-4">
          <Link href="/admin/dashboard" className="block py-3 px-6 text-gray-600 font-medium hover:bg-gray-50 hover:text-blue-600">
            <div className="flex items-center">
              <FiLayout className="mr-3" /> Dashboard
            </div>
          </Link>
          <Link href="/admin/orders" className="block py-3 px-6 text-gray-600 font-medium hover:bg-gray-50 hover:text-blue-600">
            <div className="flex items-center">
              <FiShoppingBag className="mr-3" /> Orders
            </div>
          </Link>
          <Link href="/admin/products" className="block py-3 px-6 text-gray-600 font-medium hover:bg-gray-50 hover:text-blue-600">
            <div className="flex items-center">
              <FiBox className="mr-3" /> Products
            </div>
          </Link>
          <Link href="/admin/users" className="block py-3 px-6 text-gray-600 font-medium hover:bg-gray-50 hover:text-blue-600">
            <div className="flex items-center">
              <FiUsers className="mr-3" /> Users
            </div>
          </Link>
          <Link href="/admin/contacts" className="block py-3 px-6 text-gray-600 font-medium hover:bg-gray-50 hover:text-blue-600">
            <div className="flex items-center">
              <FiMail className="mr-3" /> Contacts
            </div>
          </Link>
          <Link href="/admin/storefront" className="block py-3 px-6 text-blue-600 bg-blue-50 border-r-4 border-blue-600 font-medium">
            <div className="flex items-center">
              <FiSettings className="mr-3" /> Storefront
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full text-left py-3 px-6 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900"
          >
            <div className="flex items-center">
              <FiLogOut className="mr-3" /> Logout
            </div>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Storefront Settings</h1>
            <p className="text-gray-600">Manage your homepage carousels with drag and drop.</p>
          </div>
          <button 
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <FiSave className="mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Carousel Selector */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Your Carousels</h2>
                <button 
                  onClick={() => setShowNewModal(true)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded flex items-center text-sm font-medium"
                >
                  <FiPlus className="mr-1" /> New
                </button>
              </div>

              <div className="space-y-2">
                {carousels.length === 0 ? (
                  <p className="text-gray-500 text-sm">No carousels created yet.</p>
                ) : (
                  carousels.map((carousel) => (
                    <div 
                      key={carousel.id}
                      onClick={() => setSelectedCarouselId(carousel.id)}
                      className={`p-3 rounded border cursor-pointer flex justify-between items-center transition-colors ${selectedCarouselId === carousel.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div>
                        <div className="font-semibold text-gray-800">{carousel.title}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1">ID: {carousel.id}</div>
                      </div>
                      {selectedCarouselId === carousel.id && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteCarousel(carousel.id); }}
                          className="text-red-500 p-1 hover:bg-red-100 rounded"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Carousel Editor */}
          <div className="w-full lg:w-2/3">
            {!activeCarousel ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                Select or create a carousel to manage its products.
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold mb-1">Editing: {activeCarousel.title}</h2>
                <p className="text-sm text-gray-500 mb-6">Drag and drop products to reorder them.</p>

                {/* Product Search */}
                <div className="mb-8 relative">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search products to add..."
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={searchTerm}
                      onChange={searchProducts}
                    />
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {searchTerm.length >= 2 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {searching ? (
                        <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                      ) : searchResults.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                      ) : (
                        searchResults.map(product => (
                          <div 
                            key={product._id} 
                            onClick={() => addProductToCarousel(product)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center"
                          >
                            <img 
                              src={product.images?.[0]?.url || product.images?.[0] || product.mainImage || '/placeholder-image.jpg'} 
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded mr-3"
                            />
                            <div>
                              <div className="font-medium text-sm text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500">₹{product.price}</div>
                            </div>
                            <div className="ml-auto">
                              <button className="text-blue-600 text-sm font-medium hover:underline">Add</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Draggable Product List */}
                <div className="space-y-3">
                  {activeCarousel.products.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
                      No products in this carousel. Search above to add some!
                    </div>
                  ) : (
                    activeCarousel.products.map((item, index) => {
                      const p = item.product;
                      const imageUrl = p.images?.[0] ? (typeof p.images[0] === 'string' ? p.images[0] : (p.images[0] as any).url) : p.mainImage || '/placeholder-image.jpg';
                      
                      return (
                        <div 
                          key={p._id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDrop(e, index)}
                          className="flex items-center p-3 border rounded-lg bg-white hover:shadow-sm cursor-move transition-shadow"
                        >
                          <div className="text-gray-400 mr-4 ml-1">
                            <FiMove size={20} />
                          </div>
                          <div className="font-bold text-gray-400 w-6">{index + 1}.</div>
                          <img src={imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded mr-4" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 line-clamp-1">{p.name}</div>
                            <div className="text-sm text-gray-500">₹{p.price}</div>
                          </div>
                          <button 
                            onClick={() => removeProductFromCarousel(p._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded ml-4"
                            title="Remove from carousel"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Carousel Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Create New Carousel</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Carousel Title</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Summer Sale"
                className="w-full border rounded p-2"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Carousel ID (for code)</label>
              <input 
                type="text" 
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="e.g. home-summer-sale"
                className="w-full border rounded p-2 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Must be unique. Only lowercase letters and hyphens.</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={createCarousel}
                disabled={!newTitle || !newId}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
