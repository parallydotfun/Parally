import React, { useState, useEffect, useRef } from 'react';
import DynamicBackground from '../components/DynamicBackground';
import { ArrowLeft, Plus, Trash2, Save, Eye, Upload, Loader, CheckCircle, FolderOpen, X } from 'lucide-react';
import { useWallet } from '../services/solana';
import { AgentBuilderService, AgentDraft } from '../services/agentBuilder';
import { PaymentService, LISTING_FEE_SOL, FEE_RECIPIENT_ADDRESS } from '../services/payment';
import Notification, { useNotification } from '../components/Notification';

interface EnhancedAgentBuilderPageProps {
  onNavigate: (page: string) => void;
}

export default function EnhancedAgentBuilderPage({ onNavigate }: EnhancedAgentBuilderPageProps) {
  const { wallet, connected } = useWallet();
  const { notification, showNotification, hideNotification } = useNotification();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [currentTag, setCurrentTag] = useState('');
  const [currentCapability, setCurrentCapability] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDraftsList, setShowDraftsList] = useState(false);
  const [userDrafts, setUserDrafts] = useState<AgentDraft[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [agentConfig, setAgentConfig] = useState({
    name: '',
    description: '',
    fullDescription: '',
    category: 'AI Agent',
    price: '0.01',
    apiEndpoint: '',
    tags: [] as string[],
    capabilities: [] as string[],
    previewImages: [] as string[]
  });

  const categories = [
    'AI Agent', 'AI', 'Compute', 'Data', 'Infrastructure', 'Marketplace',
    'Tokens & NFTs', 'Data Streams', 'AI Inference', 'Digital Content', 'Other'
  ];

  useEffect(() => {
    PaymentService.initialize();
    if (connected && wallet) { initializeDraft(); }
    return () => { if (autoSaveIntervalRef.current) { clearInterval(autoSaveIntervalRef.current); } };
  }, [connected, wallet]);

  useEffect(() => {
    if (draftId && isDirty) {
      if (autoSaveIntervalRef.current) { clearInterval(autoSaveIntervalRef.current); }
      autoSaveIntervalRef.current = setInterval(() => { autoSaveDraft(); }, 30000);
    }
    return () => { if (autoSaveIntervalRef.current) { clearInterval(autoSaveIntervalRef.current); } };
  }, [draftId, isDirty, agentConfig]);

  const initializeDraft = async () => {
    if (!wallet) return;
    const newDraft = await AgentBuilderService.createDraft(wallet.publicKey.toString());
    if (newDraft && newDraft.id) {
      setDraftId(newDraft.id);
      showNotification('success', 'New draft created');
    }
  };

  const autoSaveDraft = async () => {
    if (!draftId || !wallet) return;
    const success = await AgentBuilderService.saveDraft(draftId, {
      creator_wallet: wallet.publicKey.toString(), name: agentConfig.name, description: agentConfig.description,
      full_description: agentConfig.fullDescription, category: agentConfig.category, price: parseFloat(agentConfig.price),
      api_endpoint: agentConfig.apiEndpoint, tags: agentConfig.tags, capabilities: agentConfig.capabilities, preview_images: agentConfig.previewImages
    });
    if (success) { setLastSaveTime(new Date()); setIsDirty(false); }
  };

  const handleInputChange = (field: string, value: any) => {
    setAgentConfig(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !agentConfig.tags.includes(currentTag.trim())) {
      handleInputChange('tags', [...agentConfig.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleInputChange('tags', agentConfig.tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCapability = () => {
    if (currentCapability.trim() && !agentConfig.capabilities.includes(currentCapability.trim())) {
      handleInputChange('capabilities', [...agentConfig.capabilities, currentCapability.trim()]);
      setCurrentCapability('');
    }
  };

  const handleRemoveCapability = (capToRemove: string) => {
    handleInputChange('capabilities', agentConfig.capabilities.filter(cap => cap !== capToRemove));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          showNotification('error', `${file.name} is not a valid image or video file`);
          return null;
        }
        if (file.size > 10 * 1024 * 1024) {
          showNotification('error', `${file.name} is too large. Maximum size is 10MB`);
          return null;
        }
        const url = await AgentBuilderService.compressAndUploadImage(file);
        return url;
      });
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(url => url !== null) as string[];
      if (validUrls.length > 0) {
        handleInputChange('previewImages', [...agentConfig.previewImages, ...validUrls]);
        showNotification('success', `${validUrls.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      showNotification('error', 'Failed to upload images');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) { fileInputRef.current.value = ''; }
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    handleInputChange('previewImages', agentConfig.previewImages.filter(img => img !== imageUrl));
  };

  const validateForm = (): string | null => {
    if (!agentConfig.name.trim()) return 'Agent name is required';
    if (!agentConfig.description.trim()) return 'Short description is required';
    if (!agentConfig.fullDescription.trim()) return 'Full description is required';
    if (!agentConfig.price || parseFloat(agentConfig.price) <= 0) return 'Valid price is required';
    if (!agentConfig.apiEndpoint.trim()) return 'API endpoint is required';
    if (agentConfig.capabilities.length === 0) return 'At least one capability is required';
    return null;
  };

  const handleManualSave = async () => {
    if (!connected || !wallet) { showNotification('error', 'Please connect your wallet first'); return; }
    const error = validateForm();
    if (error) { showNotification('warning', error); return; }
    setSaving(true);
    try { await autoSaveDraft(); showNotification('success', 'Draft saved successfully'); }
    catch (error) { showNotification('error', 'Failed to save draft'); }
    finally { setSaving(false); }
  };

  const handleLoadDraft = async () => {
    if (!connected || !wallet) { showNotification('error', 'Please connect your wallet first'); return; }
    const drafts = await AgentBuilderService.getUserDrafts(wallet.publicKey.toString());
    setUserDrafts(drafts);
    setShowDraftsList(true);
  };

  const handleSelectDraft = async (draft: AgentDraft) => {
    setAgentConfig({
      name: draft.name, description: draft.description, fullDescription: draft.full_description, category: draft.category,
      price: draft.price.toString(), apiEndpoint: draft.api_endpoint, tags: draft.tags, capabilities: draft.capabilities, previewImages: draft.preview_images
    });
    setDraftId(draft.id || null); setShowDraftsList(false); setIsDirty(false);
    showNotification('success', 'Draft loaded successfully');
  };

  const handlePublish = async () => {
    const error = validateForm();
    if (error) { showNotification('warning', error); return; }
    if (!connected || !wallet) { showNotification('error', 'Please connect your wallet first'); return; }
    const balance = await PaymentService.getBalance(wallet.publicKey.toString());
    if (balance < LISTING_FEE_SOL) {
      showNotification('error', `Insufficient balance. You need at least ${LISTING_FEE_SOL} SOL to list an agent`);
      return;
    }
    setPublishing(true);
    try {
      showNotification('info', `Processing payment of ${LISTING_FEE_SOL} SOL...`);
      const paymentResult = await PaymentService.sendListingFee(wallet);
      if (!paymentResult.success) { throw new Error(paymentResult.error || 'Payment failed'); }
      if (draftId) {
        await AgentBuilderService.saveDraft(draftId, {
          creator_wallet: wallet.publicKey.toString(), name: agentConfig.name, description: agentConfig.description,
          full_description: agentConfig.fullDescription, category: agentConfig.category, price: parseFloat(agentConfig.price),
          api_endpoint: agentConfig.apiEndpoint, tags: agentConfig.tags, capabilities: agentConfig.capabilities, preview_images: agentConfig.previewImages
        });
      }
      await AgentBuilderService.recordListingFee({
        creator_wallet: wallet.publicKey.toString(), fee_amount: LISTING_FEE_SOL,
        transaction_signature: paymentResult.signature!, recipient_address: FEE_RECIPIENT_ADDRESS, status: 'pending'
      });
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/marketplace_items`, {
        method: 'POST', headers: { 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify({
          name: agentConfig.name, description: agentConfig.description, full_description: agentConfig.fullDescription, category: agentConfig.category,
          type: 'agent', price: parseFloat(agentConfig.price), currency: 'USDC', blockchain: 'Solana', x402_ready: true, api_endpoint: agentConfig.apiEndpoint,
          tags: agentConfig.tags, created_by: wallet.publicKey.toString(), is_active: true, executions: 0, revenue: 0, score: 0,
          has_preview: agentConfig.previewImages.length > 0, preview_image: agentConfig.previewImages[0] || null, draft_id: draftId, average_rating: 0, review_count: 0
        })
      });
      if (response.ok) {
        const [createdItem] = await response.json();
        if (createdItem && paymentResult.signature) {
          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/listing_fees?transaction_signature=eq.${paymentResult.signature}`, {
            method: 'PATCH', headers: { 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_id: createdItem.id })
          });
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        const confirmed = await PaymentService.waitForConfirmation(paymentResult.signature!);
        if (confirmed) { await AgentBuilderService.updateListingFeeStatus(paymentResult.signature!, 'confirmed'); }
        if (draftId) { await AgentBuilderService.deleteDraft(draftId); }
        showNotification('success', 'Agent published successfully to the marketplace!');
        setTimeout(() => { onNavigate('marketplace'); }, 2000);
      } else { throw new Error('Failed to publish agent'); }
    } catch (error) {
      console.error('Publishing error:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to publish agent');
    } finally { setPublishing(false); }
  };

  return (
    <DynamicBackground>
    <div className="min-h-screen bg-transparent pt-32 pb-16">
      {notification && <Notification type={notification.type} message={notification.message} onClose={hideNotification} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => onNavigate('marketplace')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /><span className="font-medium">BACK</span>
        </button>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">PARALLY Agent Builder</h1>
              <p className="text-lg text-gray-400">Create and publish your AI agent to the Parally Marketplace</p>
            </div>
            {lastSaveTime && <div className="text-sm text-gray-400 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Last saved: {lastSaveTime.toLocaleTimeString()}</div>}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
              <div className="space-y-6">
                <div><label className="block text-sm font-medium text-gray-300 mb-2">Agent Name *</label><input type="text" value={agentConfig.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="e.g., Financial Advisor" className="w-full bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-2">Short Description *</label><input type="text" value={agentConfig.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Brief one-line description" className="w-full bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-2">Full Description *</label><textarea value={agentConfig.fullDescription} onChange={(e) => handleInputChange('fullDescription', e.target.value)} placeholder="Detailed description..." rows={6} className="w-full bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-2">Category *</label><select value={agentConfig.category} onChange={(e) => handleInputChange('category', e.target.value)} className="w-full bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Preview Media</h2>
              <div className="space-y-4">
                <div><input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleImageUpload} className="hidden" /><button onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="w-full bg-black/20 border-2 border-dashed border-gray-800 rounded-lg px-4 py-8 text-gray-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-colors flex flex-col items-center gap-3 disabled:opacity-50">{uploadingImage ? <><Loader className="w-8 h-8 animate-spin" /><span>Uploading...</span></> : <><Upload className="w-8 h-8" /><span className="font-medium">Upload Preview Images/Videos</span><span className="text-sm">PNG, JPG, GIF, MP4 (Max 10MB each)</span></>}</button></div>
                {agentConfig.previewImages.length > 0 && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{agentConfig.previewImages.map((imageUrl, index) => <div key={index} className="relative group"><img src={imageUrl} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" /><button onClick={() => handleRemoveImage(imageUrl)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button></div>)}</div>}
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Capabilities & Features</h2>
              <div className="space-y-6">
                <div><label className="block text-sm font-medium text-gray-300 mb-2">Agent Capabilities *</label><div className="flex gap-2 mb-3"><input type="text" value={currentCapability} onChange={(e) => setCurrentCapability(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCapability())} placeholder="e.g., Portfolio analysis" className="flex-1 bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent" /><button onClick={handleAddCapability} className="px-4 py-3 text-white rounded-lg transition-colors flex items-center gap-2" style={{ backgroundColor: '#FF4D00' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}><Plus className="w-5 h-5" />Add</button></div>{agentConfig.capabilities.length > 0 && <div className="space-y-2">{agentConfig.capabilities.map((capability, index) => <div key={index} className="flex items-center justify-between bg-black/20 border border-gray-800 rounded-lg px-4 py-2"><span className="text-white">{capability}</span><button onClick={() => handleRemoveCapability(capability)} className="text-red-600 hover:text-red-700 transition-colors"><Trash2 className="w-4 h-4" /></button></div>)}</div>}</div>
                <div><label className="block text-sm font-medium text-gray-300 mb-2">Tags</label><div className="flex gap-2 mb-3"><input type="text" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} placeholder="e.g., finance, AI" className="flex-1 bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent" /><button onClick={handleAddTag} className="px-4 py-3 text-white rounded-lg transition-colors flex items-center gap-2" style={{ backgroundColor: '#FF4D00' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}><Plus className="w-5 h-5" />Add</button></div>{agentConfig.tags.length > 0 && <div className="flex flex-wrap gap-2">{agentConfig.tags.map((tag, index) => <div key={index} className="flex items-center gap-2 bg-black/20 border border-gray-800 rounded-lg px-3 py-1.5"><span className="text-white text-sm">{tag}</span><button onClick={() => handleRemoveTag(tag)} className="text-red-600 hover:text-red-700 transition-colors"><Trash2 className="w-3 h-3" /></button></div>)}</div>}</div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Technical Configuration</h2>
              <div><label className="block text-sm font-medium text-gray-300 mb-2">API Endpoint *</label><input type="text" value={agentConfig.apiEndpoint} onChange={(e) => handleInputChange('apiEndpoint', e.target.value)} placeholder="https://api.example.com/agent/execute" className="w-full bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent" /><p className="text-sm text-gray-400 mt-2">The API endpoint that will be called when users execute your agent</p></div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Pricing & Publishing</h2>
              <div className="space-y-6">
                <div><label className="block text-sm font-medium text-gray-300 mb-2">Price per Execution *</label><div className="relative"><input type="number" value={agentConfig.price} onChange={(e) => handleInputChange('price', e.target.value)} step="0.001" min="0" placeholder="0.01" className="w-full bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-16" /><span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">USDC</span></div><p className="text-sm text-gray-400 mt-2">Set your price in USDC per agent execution</p></div>
                <div className="pt-4 border-t border-gray-800">
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-4 mb-4"><div className="flex items-center justify-between mb-2"><span className="text-sm text-gray-400">PRICE</span><span className="text-2xl font-bold text-white">${agentConfig.price || '0.00'}</span></div><div className="text-xs text-gray-400 mb-3">USDC per execution</div><div className="pt-3 border-t border-gray-800"><div className="flex items-center justify-between text-sm"><span className="text-gray-400">Listing Fee</span><span className="text-orange-600 font-medium">{LISTING_FEE_SOL} SOL</span></div></div></div>
                  <div className="space-y-3">
                    <button onClick={handleLoadDraft} disabled={!connected} className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"><FolderOpen className="w-5 h-5" />Load Draft</button>
                    <button onClick={() => setShowPreview(!showPreview)} className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"><Eye className="w-5 h-5" />{showPreview ? 'Hide Preview' : 'Preview Agent'}</button>
                    <button onClick={handleManualSave} disabled={saving || !connected} className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{saving ? <><Loader className="w-5 h-5 animate-spin" />Saving...</> : <><Save className="w-5 h-5" />Save Draft</>}</button>
                    <button onClick={handlePublish} disabled={publishing || !connected} className="w-full text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2" style={{ backgroundColor: '#FF4D00' }} onMouseEnter={(e) => !publishing && !(!connected) && (e.currentTarget.style.opacity = '0.9')} onMouseLeave={(e) => !publishing && !(!connected) && (e.currentTarget.style.opacity = '1')}>{publishing ? <><Loader className="w-5 h-5 animate-spin" />Publishing...</> : <><Upload className="w-5 h-5" />Publish ({LISTING_FEE_SOL} SOL)</>}</button>
                    {!connected && <p className="text-sm text-center" style={{ color: '#FF4D00' }}>Connect wallet to publish</p>}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Publishing Info</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span>x402 protocol enabled</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-full"></div><span>Solana blockchain</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-500 rounded-full"></div><span>Auto-save every 30 seconds</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span>Instant marketplace listing</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showPreview && <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-8"><h2 className="text-2xl font-bold text-white mb-6">Marketplace Preview</h2><div className="bg-black/20 border border-gray-800 rounded-lg p-6 border border-gray-200">{agentConfig.previewImages.length > 0 && <div className="mb-6"><img src={agentConfig.previewImages[0]} alt="Preview" className="w-full h-64 object-cover rounded-lg" /></div>}<div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6"><div className="flex-1"><h3 className="text-3xl font-bold text-white mb-3">{agentConfig.name || 'Your Agent Name'}</h3><p className="text-lg text-gray-400 mb-4">{agentConfig.description || 'Your short description'}</p><div className="flex items-center gap-2"><span className="px-3 py-1 bg-gray-100 text-gray-300 text-sm rounded-lg font-medium">{agentConfig.category}</span><span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg font-medium">x402 Ready</span><span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-lg font-medium flex items-center gap-1.5"><svg className="w-4 h-4" viewBox="0 0 397.7 311.7" fill="currentColor"><path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/><path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/><path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/></svg>Solana</span></div></div><div className="text-right"><div className="text-sm font-medium text-gray-400 mb-1">PRICE</div><div className="text-4xl font-bold text-white">${agentConfig.price || '0.00'}<span className="text-xl text-gray-400 ml-1">USDC</span></div></div></div><div className="grid grid-cols-3 gap-4 mb-6"><div className="bg-white rounded-lg p-4 border border-gray-200"><div className="text-sm font-medium text-gray-400 mb-2">EXECUTIONS</div><div className="text-2xl font-bold text-white">0</div></div><div className="bg-white rounded-lg p-4 border border-gray-200"><div className="text-sm font-medium text-gray-400 mb-2">REVENUE</div><div className="text-2xl font-bold text-white">$0.00</div></div><div className="bg-white rounded-lg p-4 border border-gray-200"><div className="text-sm font-medium text-gray-400 mb-2">RATING</div><div className="text-2xl font-bold text-white">0.0</div></div></div>{agentConfig.capabilities.length > 0 && <div className="mb-6"><h4 className="text-lg font-bold text-white mb-3">Capabilities</h4><ul className="space-y-2">{agentConfig.capabilities.map((cap, index) => <li key={index} className="flex items-center gap-2 text-gray-300"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>{cap}</li>)}</ul></div>}{agentConfig.fullDescription && <div><h4 className="text-lg font-bold text-white mb-3">About This Agent</h4><p className="text-gray-400 leading-relaxed">{agentConfig.fullDescription}</p></div>}</div></div>}
        {showDraftsList && <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-black/90 backdrop-blur-md rounded-xl p-8 max-w-2xl border border-gray-800 w-full max-h-[80vh] overflow-y-auto border border-gray-200 shadow-xl"><div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-white">Load Draft</h2><button onClick={() => setShowDraftsList(false)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button></div>{userDrafts.length === 0 ? <p className="text-gray-400 text-center py-8">No drafts found</p> : <div className="space-y-3">{userDrafts.map((draft) => <button key={draft.id} onClick={() => handleSelectDraft(draft)} className="w-full bg-black/20 border border-gray-800 rounded-lg p-4 text-left hover:border-orange-500 hover:bg-orange-50 transition-colors"><h3 className="text-white font-semibold mb-1">{draft.name || 'Untitled Draft'}</h3><p className="text-sm text-gray-400 mb-2">{draft.description || 'No description'}</p><div className="flex items-center justify-between text-xs text-gray-400"><span>{draft.category}</span><span>Last saved: {new Date(draft.last_saved_at || draft.updated_at || '').toLocaleString()}</span></div></button>)}</div>}</div></div>}
      </div>
    </div>
    </DynamicBackground>
  );
}
