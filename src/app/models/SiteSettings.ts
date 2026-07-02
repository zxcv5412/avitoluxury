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

const SiteSettingsSchema = new mongoose.Schema({
  // Global identifier for settings, usually just one document
  settingId: {
    type: String,
    default: 'global',
    unique: true
  },
  carousels: [CarouselConfigSchema]
}, {
  timestamps: true
});

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
