import mongoose from 'mongoose';

const CarouselProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, { _id: false });

const SiteSettingsSchema = new mongoose.Schema({
  settingId: {
    type: String,
    default: 'global',
    unique: true
  },
  heroProducts: [CarouselProductSchema]
}, {
  timestamps: true
});

const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
