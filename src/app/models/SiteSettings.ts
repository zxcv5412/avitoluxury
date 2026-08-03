import mongoose from 'mongoose';

const CarouselProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, { _id: false });

const CarouselConfigSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  products: [CarouselProductSchema]
}, { _id: false });

const StorySwatchSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  linkUrl: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { _id: false });

const SiteSettingsSchema = new mongoose.Schema({
  settingId: {
    type: String,
    default: 'global',
    unique: true
  },
  presets: [CarouselConfigSchema],
  activePresetId: {
    type: String,
    default: 'default'
  },
  storySwatches: [StorySwatchSchema]
}, {
  timestamps: true
});

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
