'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiBox, FiShoppingBag, FiUsers, FiLogOut, FiSettings, FiPlus, FiTrash2, FiMove, FiSearch, FiSave, FiMail, FiUpload } from 'react-icons/fi';
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

interface PresetConfig {
  id: string;
  title: string;
  products: CarouselProduct[];
}

interface StorySwatch {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive?: boolean;
  order?: number;
}

export default function StorefrontSettings() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  
  // Presets State
  const [presets, setPresets] = useState<PresetConfig[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [activePresetId, setActivePresetId] = useState<string>('default');

  // Story Swatches State
  const [storySwatches, setStorySwatches] = useState<StorySwatch[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Product Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // New Preset Modal State
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
        const loadedPresets = data.presets || [];
        setPresets(loadedPresets);
        setActivePresetId(data.activePresetId || 'default');
        setStorySwatches(data.storySwatches || []);
        
        if (loadedPresets.length > 0) {
          // If previous selection is invalid or empty, set to first preset
          const hasSelected = loadedPresets.some((p: any) => p.id === selectedPresetId);
          if (!hasSelected) {
            setSelectedPresetId(loadedPresets[0].id);
          }
        }
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

  const activePreset = presets.find(p => p.id === selectedPresetId);

  const addProductToPreset = (product: any) => {
    if (!selectedPresetId) return;
    
    // Check if already in preset
    const currentProducts = activePreset?.products || [];
    if (currentProducts.some(p => p.product._id === product._id)) {
      return;
    }

    const updatedPresets = presets.map(p => {
      if (p.id === selectedPresetId) {
        return {
          ...p,
          products: [...p.products, { product }]
        };
      }
      return p;
    });

    setPresets(updatedPresets);
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeProductFromPreset = (productId: string) => {
    if (!selectedPresetId) return;

    const updatedPresets = presets.map(p => {
      if (p.id === selectedPresetId) {
        return {
          ...p,
          products: p.products.filter(item => item.product._id !== productId)
        };
      }
      return p;
    });

    setPresets(updatedPresets);
  };

  const createPreset = () => {
    if (!newId || !newTitle) return;
    const formattedId = newId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    if (presets.some(p => p.id === formattedId)) {
      alert('A preset with this ID already exists');
      return;
    }

    const newPreset: PresetConfig = {
      id: formattedId,
      title: newTitle,
      products: []
    };

    setPresets([...presets, newPreset]);
    setSelectedPresetId(formattedId);
    setShowNewModal(false);
    setNewId('');
    setNewTitle('');
  };

  const deletePreset = (id: string) => {
    if (id === 'default') {
      alert('The Main preset cannot be deleted');
      return;
    }
    if (confirm('Are you sure you want to delete this preset?')) {
      const updated = presets.filter(p => p.id !== id);
      setPresets(updated);
      
      // If we deleted the active preset, fall back active preset to default
      if (activePresetId === id) {
        setActivePresetId('default');
      }

      if (selectedPresetId === id) {
        setSelectedPresetId(updated.length > 0 ? updated[0].id : '');
      }
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = getAdminToken();
      const payloadPresets = presets.map(p => ({
        id: p.id,
        title: p.title,
        products: p.products.map(item => ({ product: item.product._id }))
      }));

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ presets: payloadPresets, activePresetId, storySwatches })
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

  // Swatches Management Handlers
  const addSwatch = (title = 'NEW SIZE', linkUrl = '/collection?volume=50ml', imageUrl = '') => {
    const newSwatch: StorySwatch = {
      id: `swatch-${Date.now()}`,
      title,
      imageUrl,
      linkUrl,
      isActive: true,
      order: storySwatches.length + 1
    };
    setStorySwatches(prev => [...prev, newSwatch]);
  };

  const updateSwatch = (index: number, key: keyof StorySwatch, val: any) => {
    setStorySwatches(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: val };
      return copy;
    });
  };

  const removeSwatch = (index: number) => {
    setStorySwatches(prev => prev.filter((_, i) => i !== index));
  };

  const moveSwatch = (index: number, direction: 'left' | 'right') => {
    if ((direction === 'left' && index === 0) || (direction === 'right' && index === storySwatches.length - 1)) return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    setStorySwatches(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleSwatchFileUpload = async (index: number, file: File) => {
    try {
      setUploadingIndex(index);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'swatches');
      
      const res = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data.success && data.url) {
        updateSwatch(index, 'imageUrl', data.url);
      } else {
        throw new Error(data.error || 'Failed to upload image');
      }
    } catch (err: any) {
      alert(err.message || 'Error uploading image');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('draggedIndex', index.toString());
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    const draggedIndexStr = e.dataTransfer.getData('draggedIndex');
    if (!draggedIndexStr || !selectedPresetId) return;
    const draggedIndex = parseInt(draggedIndexStr, 10);
    
    if (draggedIndex === targetIndex) return;

    const currentPreset = presets.find(p => p.id === selectedPresetId);
    if (!currentPreset) return;

    const newProducts = [...currentPreset.products];
    const [draggedItem] = newProducts.splice(draggedIndex, 1);
    newProducts.splice(targetIndex, 0, draggedItem);

    const updatedPresets = presets.map(p => {
      if (p.id === selectedPresetId) {
        return {
          ...p,
          products: newProducts
        };
      }
      return p;
    });

    setPresets(updatedPresets);
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
            <p className="text-gray-600">Manage sliding hero banner presets and swap which one is live.</p>
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Preset Selector */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Your Presets</h2>
                <button 
                  onClick={() => setShowNewModal(true)}
                  className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center text-sm font-semibold transition"
                >
                  <FiPlus className="mr-1" /> New
                </button>
              </div>

              <div className="space-y-2">
                {presets.map((preset) => {
                  const isDefault = preset.id === 'default';
                  return (
                    <div 
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`p-3 rounded-lg border cursor-pointer flex justify-between items-center transition ${selectedPresetId === preset.id ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                      <div>
                        <div className="font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
                          {preset.title}
                          {activePresetId === preset.id && (
                            <span className="px-1.5 py-0.5 text-[9px] bg-green-50 text-green-600 border border-green-200 rounded font-semibold uppercase tracking-wider">Active</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-1">ID: {preset.id}</div>
                      </div>
                      {selectedPresetId === preset.id && !isDefault && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); deletePreset(preset.id); }}
                          className="text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Switcher Card */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Active Banner Preset</h2>
              <p className="text-xs text-gray-500 mb-4">Choose which preset is currently live on your website.</p>
              
              <div>
                <select 
                  value={activePresetId}
                  onChange={(e) => setActivePresetId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {presets.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} {p.id === 'default' ? '(Main)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Preset Editor */}
          <div className="w-full lg:w-2/3">
            {!activePreset ? (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500 border border-gray-100">
                Select or create a preset to manage its products.
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Editing Preset: {activePreset.title}</h2>
                <p className="text-sm text-gray-500 mb-6">Search and add products to this preset, then drag and drop to reorder.</p>

                {/* Product Search */}
                <div className="mb-8 relative">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search products to add..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                            onClick={() => addProductToPreset(product)}
                            className="p-3 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
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
                  {activePreset.products.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      No products in this preset yet. Use the search bar above to add products.
                    </div>
                  ) : (
                    activePreset.products.map((p, index) => (
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
                          onClick={() => removeProductFromPreset(p.product._id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-550 rounded-lg transition"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Homepage Story Circle Swatches Manager */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8 mt-8">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Homepage Circle Swatches ("Shop By Size & Category")</h2>
              <p className="text-xs text-gray-500 mt-1">Manage the story-style circles displayed on your homepage under the Trust Ribbon.</p>
            </div>
            <button
              onClick={() => addSwatch()}
              className="px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 flex items-center gap-1 transition"
            >
              <FiPlus /> Add Swatch
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Quick Add Presets Bar */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-blue-900">Quick Add Suggestions:</span>
              <button onClick={() => addSwatch('2 ML ROLL-ONS', '/collection?volume=2ml')} className="px-2 py-1 bg-white border border-blue-200 rounded text-blue-800 hover:bg-blue-100">+ 2ml Roll-ons</button>
              <button onClick={() => addSwatch('3 ML ATTARS', '/collection?volume=3ml')} className="px-2 py-1 bg-white border border-blue-200 rounded text-blue-800 hover:bg-blue-100">+ 3ml Attars</button>
              <button onClick={() => addSwatch('6 ML ATTARS', '/collection?volume=6ml')} className="px-2 py-1 bg-white border border-blue-200 rounded text-blue-800 hover:bg-blue-100">+ 6ml Attars</button>
              <button onClick={() => addSwatch('12 ML ATTARS', '/collection?volume=12ml')} className="px-2 py-1 bg-white border border-blue-200 rounded text-blue-800 hover:bg-blue-100">+ 12ml Attars</button>
              <button onClick={() => addSwatch('30 ML PERFUMES', '/collection?volume=30ml')} className="px-2 py-1 bg-white border border-blue-200 rounded text-blue-800 hover:bg-blue-100">+ 30ml Perfumes</button>
              <button onClick={() => addSwatch('50 ML PERFUMES', '/collection?volume=50ml')} className="px-2 py-1 bg-white border border-blue-200 rounded text-blue-800 hover:bg-blue-100">+ 50ml Perfumes</button>
              <button onClick={() => addSwatch('100 ML SPRAYS', '/collection?volume=100ml')} className="px-2 py-1 bg-white border border-blue-200 rounded text-blue-800 hover:bg-blue-100">+ 100ml Sprays</button>
              <button onClick={() => addSwatch('CAR FRESHENERS', '/air-fresheners/car')} className="px-2 py-1 bg-white border border-blue-200 rounded text-blue-800 hover:bg-blue-100">+ Car Diffusers</button>
            </div>

            {storySwatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No custom swatches configured yet. Default volume circles (2ml, 6ml, 12ml, 50ml, etc.) will be shown on the homepage until custom ones are created.
              </div>
            ) : (
              <div className="space-y-3">
                {storySwatches.map((swatch, idx) => (
                  <div key={swatch.id || idx} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-300 relative">
                      {swatch.imageUrl ? (
                        <img src={swatch.imageUrl} alt={swatch.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">#{idx + 1}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1 w-full text-xs">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase">Label Title</label>
                        <input
                          type="text"
                          value={swatch.title}
                          onChange={(e) => updateSwatch(idx, 'title', e.target.value)}
                          placeholder="e.g. 50 ML PERFUMES"
                          className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase">Circle Image</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={swatch.imageUrl}
                            onChange={(e) => updateSwatch(idx, 'imageUrl', e.target.value)}
                            placeholder="Image URL or upload..."
                            className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded font-mono text-[10px]"
                          />
                          <label className="cursor-pointer px-2 py-1 bg-black text-white text-[10px] font-semibold rounded hover:bg-gray-800 flex items-center gap-1 flex-shrink-0">
                            <FiUpload className="w-3 h-3" />
                            {uploadingIndex === idx ? '...' : 'Upload'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingIndex === idx}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleSwatchFileUpload(idx, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 uppercase">Target Link URL</label>
                        <input
                          type="text"
                          value={swatch.linkUrl}
                          onChange={(e) => updateSwatch(idx, 'linkUrl', e.target.value)}
                          placeholder="/collection?volume=50ml"
                          className="w-full px-2 py-1 bg-white border border-gray-300 rounded font-mono text-[10px]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateSwatch(idx, 'isActive', !swatch.isActive)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded ${swatch.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}
                      >
                        {swatch.isActive !== false ? 'Active' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => moveSwatch(idx, 'left')}
                        disabled={idx === 0}
                        className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 text-xs disabled:opacity-30"
                      >
                        &uarr;
                      </button>
                      <button
                        onClick={() => moveSwatch(idx, 'right')}
                        disabled={idx === storySwatches.length - 1}
                        className="px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 text-xs disabled:opacity-30"
                      >
                        &darr;
                      </button>
                      <button
                        onClick={() => removeSwatch(idx)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Preset Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Hero Preset</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preset Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Summer Deals"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newId) {
                      setNewId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preset ID (URL Safe)</label>
                <input 
                  type="text" 
                  placeholder="e.g. summer-deals"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={createPreset}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Create Preset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
