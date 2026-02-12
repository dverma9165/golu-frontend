import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  LuHeart, LuCreditCard, LuCake, LuGift, LuTag, LuSmartphone,
  LuMegaphone, LuFileImage, LuPenTool, LuFileText, LuAward,
  LuStar, LuMail, LuFile, LuReceipt, LuNewspaper, LuBookOpen,
  LuUtensils, LuBriefcase, LuCalendar, LuIdCard, LuImage,
  LuMonitor, LuTrendingUp, LuProjector, LuBook, LuShirt,
  LuCoffee, LuLayoutTemplate, LuFlag, LuMailOpen, LuPercent,
  LuSearch, LuX, LuChevronDown, LuSlidersHorizontal, LuZoomOut,
  LuBox, LuLayoutGrid, LuCircleUser
} from 'react-icons/lu';

/* ─── CONSTANTS ─── */
const CATEGORY_ICONS = {
  'Wedding Card': LuHeart, 'Visiting Card': LuCreditCard, 'Invitation Card': LuMail,
  'Birthday Banner': LuCake, 'Festival Post': LuGift, 'Political Banner': LuMegaphone,
  'Business Flyer': LuFileText, 'Social Media Post': LuSmartphone, 'Logo Design': LuPenTool,
  'Letterhead': LuFile, 'Bill Book': LuReceipt, 'Pamphlet': LuNewspaper,
  'Brochure': LuBookOpen, 'Menu Card': LuUtensils, 'Certificate': LuAward,
  'Resume/CV': LuBriefcase, 'Calendar': LuCalendar, 'Sticker/Label': LuTag,
  'Envelope': LuMailOpen, 'ID Card': LuIdCard, 'Poster': LuImage,
  'Thumbnail': LuImage, 'Web Banner': LuMonitor, 'Infographic': LuTrendingUp,
  'Presentation': LuProjector, 'E-Book Cover': LuBook, 'T-Shirt Design': LuShirt,
  'Mug Design': LuCoffee, 'Standee': LuLayoutTemplate, 'Flex Banner': LuFlag, 'Other': LuBox,
};

const categories = ['All', 'Wedding Card', 'Visiting Card', 'Invitation Card', 'Birthday Banner', 'Festival Post', 'Political Banner', 'Business Flyer', 'Social Media Post', 'Logo Design', 'Letterhead', 'Bill Book', 'Pamphlet', 'Brochure', 'Menu Card', 'Certificate', 'Resume/CV', 'Calendar', 'Sticker/Label', 'Envelope', 'ID Card', 'Poster', 'Thumbnail', 'Web Banner', 'Infographic', 'Presentation', 'E-Book Cover', 'T-Shirt Design', 'Mug Design', 'Standee', 'Flex Banner', 'Other'];

const priceRanges = [
  { value: 'All', label: 'All Prices' },
  { value: 'Free', label: 'Free' },
  { value: '0-10', label: '₹0–₹10' },
  { value: '10-20', label: '₹10–₹20' },
  { value: '20-30', label: '₹20–₹30' },
  { value: '30-50', label: '₹30–₹50' },
  { value: '50-100', label: '₹50–₹100' },
  { value: '100-200', label: '₹100–₹200' },
  { value: '200-500', label: '₹200–₹500' },
  { value: '500+', label: '₹500+' },
  { value: 'Custom', label: 'Custom Range' },
];

const fileTypes = ['CDR', 'PSD', 'AI', 'PDF', 'EPS', 'INDD', 'SVG', 'PNG', 'JPG'];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-low', label: 'Price: Low' },
  { value: 'price-high', label: 'Price: High' },
  { value: 'rating-high', label: 'Top Rated' },
];

/* ─── HELPERS ─── */
const discount = (price, sale) =>
  price && sale && sale < price ? Math.round(((price - sale) / price) * 100) : null;

/* ─── PRODUCT CARD ─── */
const ProductCard = ({ file }) => {
  const thumb = file.thumbnail?.googleDriveId
    ? `https://lh3.googleusercontent.com/d/${file.thumbnail.googleDriveId}`
    : null;
  const disc = discount(file.price, file.salePrice);
  const displayPrice = file.salePrice ?? file.price ?? 0;
  const savedAmount = file.price && file.salePrice ? file.price - file.salePrice : 0;

  return (
    <Link
      to={`/product/${file._id}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200"
      style={{ textDecoration: 'none' }}
    >
      {/* Thumbnail */}
      <div className="relative bg-gray-50 overflow-hidden" style={{ paddingTop: '100%' }}>
        {thumb ? (
          <img
            src={thumb}
            alt={file.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <LuFileImage className="text-gray-300 text-4xl" />
          </div>
        )}
        {/* Discount badge */}
        {disc && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
            {disc}% OFF
          </span>
        )}
        {/* File type badge - Sticker Style */}
        {file.fileType && (
          <div className="absolute bottom-2 right-2 bg-white border border-gray-200 shadow-sm rounded-md px-1.5 py-0.5 flex flex-col items-center justify-center transform hover:scale-105 transition-transform">
            <span className="text-[10px] font-black text-red-600 uppercase leading-none tracking-tighter">
              {file.fileType}
            </span>
            {file.version && (
              <span className="text-[8px] font-bold text-blue-600 uppercase leading-none tracking-tighter mt-0.5">
                {file.version}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-xs text-indigo-500 font-medium truncate">{file.category || 'Design'}</p>
        <p
          className="text-[15px] font-bold text-gray-800 leading-tight mt-1 line-clamp-2 min-h-[2.5em]"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {file.title || file.originalName || 'Untitled'}
        </p>

        {/* Rating */}
        {(file.rating || 0) > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <span className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              <LuStar className="text-[9px] fill-current" /> {file.rating?.toFixed(1)}
            </span>
            <span className="text-gray-400 text-[10px]">({file.numReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {displayPrice === 0 ? 'FREE' : `₹${displayPrice}`}
          </span>
          {disc && (
            <span className="text-xs text-gray-400 line-through">₹{file.price}</span>
          )}
          {savedAmount > 0 && (
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded ml-auto">
              You saved ₹{savedAmount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ─── FILTER BOTTOM SHEET (Mobile) ─── */
const FilterSheet = ({
  visible, onClose,
  category, setCategory,
  priceRange, setPriceRange,
  customMin, setCustomMin,
  customMax, setCustomMax,
  fileType, setFileType,
  sortBy, setSortBy,
  fontsIncluded, setFontsIncluded,
  onClear,
}) => (
  <>
    {visible && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />}
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl transition-transform duration-300 overflow-y-auto"
      style={{ maxHeight: '80vh', transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>
      <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">Filters & Sort</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
          <LuX className="text-gray-500 w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Sort */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Sort By</p>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map(opt => (
              <button key={opt.value} onClick={() => setSortBy(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${sortBy === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Category</p>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${category === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Price Range</p>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map(r => (
              <button key={r.value} onClick={() => setPriceRange(r.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${priceRange === r.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                {r.label}
              </button>
            ))}
          </div>
          {priceRange === 'Custom' && (
            <div className="flex items-center gap-2 mt-2">
              <input type="number" placeholder="Min ₹" value={customMin} onChange={e => setCustomMin(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              <span className="text-gray-400">–</span>
              <input type="number" placeholder="Max ₹" value={customMax} onChange={e => setCustomMax(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            </div>
          )}
        </div>

        {/* File Type */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">File Type</p>
          <div className="flex flex-wrap gap-2">
            {fileTypes.map(ft => (
              <button key={ft}
                onClick={() => setFileType(prev => prev.includes(ft) ? prev.filter(x => x !== ft) : [...prev, ft])}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${fileType.includes(ft) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                {ft}
              </button>
            ))}
          </div>
        </div>

        {/* Fonts */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fonts Included</p>
          <div className="flex gap-2">
            {['All', 'Yes', 'No'].map(f => (
              <button key={f} onClick={() => setFontsIncluded(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${fontsIncluded === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}>
                {f === 'All' ? 'All' : f === 'Yes' ? 'With Fonts' : 'No Fonts'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 flex gap-3 border-t border-gray-100">
        <button onClick={onClear}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          Clear All
        </button>
        <button onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  </>
);

/* ─── FEED SECTION CARD (horizontal scroll) ─── */
const FeedCard = ({ file }) => {
  const thumb = file.thumbnail?.googleDriveId
    ? `https://lh3.googleusercontent.com/d/${file.thumbnail.googleDriveId}`
    : null;
  const disc = discount(file.price, file.salePrice);
  const displayPrice = file.salePrice ?? file.price ?? 0;
  const savedAmount = file.price && file.salePrice ? file.price - file.salePrice : 0;

  return (
    <Link
      to={`/product/${file._id}`}
      className="flex-none w-44 sm:w-48 bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 group flex flex-col h-full"
      style={{ textDecoration: 'none' }}
    >
      <div className="relative bg-gray-50 overflow-hidden" style={{ paddingTop: '100%' }}>
        {thumb ? (
          <img src={thumb} alt={file.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <LuFileImage className="text-gray-300 text-3xl" />
          </div>
        )}
        {disc && (
          <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
            {disc}% OFF
          </span>
        )}
        {file.fileType && (
          <div className="absolute bottom-1.5 right-1.5 bg-white border border-gray-200 shadow-sm rounded-md px-1 py-0.5 flex flex-col items-center justify-center">
            <span className="text-[9px] font-black text-red-600 uppercase leading-none tracking-tighter">
              {file.fileType}
            </span>
            {file.version && (
              <span className="text-[7px] font-bold text-blue-600 uppercase leading-none tracking-tighter mt-0.5">
                {file.version}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2 h-9" title={file.title}>{file.title || 'Untitled'}</p>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-base font-bold text-gray-900">{displayPrice === 0 ? 'FREE' : `₹${displayPrice}`}</span>
          {disc && <span className="text-xs text-gray-400 line-through">₹{file.price}</span>}
          {savedAmount > 0 && (
            <span className="text-[9px] font-bold text-green-600 ml-auto">
              Save ₹{savedAmount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ─── HORIZONTAL SCROLL ROW ─── */
const FeedRow = ({ title, subtitle, icon: Icon, bgGradient, textColor, items, onSeeAll, loading: rowLoading }) => {
  const scrollRef = useRef(null);

  if (!rowLoading && (!items || items.length === 0)) return null;

  return (
    <div className={`mb-4 pb-2 ${bgGradient || 'bg-white'} rounded-xl mx-3 sm:mx-0 overflow-hidden shadow-sm border border-gray-100/50`}>
      {/* Section Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className={`w-5 h-5 ${textColor || 'text-gray-700'}`} />}
          <div>
            <h3 className={`text-base font-bold tracking-tight ${textColor || 'text-gray-900'}`}>{title}</h3>
            {subtitle && <p className={`text-[11px] ${textColor ? textColor + '/80' : 'text-gray-500'}`}>{subtitle}</p>}
          </div>
        </div>
        {onSeeAll && (
          <button onClick={onSeeAll}
            className={`text-xs font-bold ${textColor || 'text-indigo-600'} hover:opacity-80 whitespace-nowrap px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm transition-all shadow-sm`}>
            See All →
          </button>
        )}
      </div>
      {/* Scrollable Row */}
      <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide gap-3 px-4 pb-4 bg-transparent snap-x items-stretch">
        {rowLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-none w-44 sm:w-48 rounded-xl bg-white/60 animate-pulse snap-start" style={{ height: 220 }} />
          ))
        ) : (
          items.map(file => <div key={file._id} className="snap-start flex"><FeedCard file={file} /></div>)
        )}
      </div>
    </div>
  );
};

/* ─── FEED SECTIONS DEFINITIONS (30+ sections) ─── */
const FEED_SECTIONS = [
  // ── Curated / Smart Sections ──
  { id: 'newest', title: 'Just Arrived', subtitle: 'Fresh new designs', icon: LuGift, bgGradient: 'bg-gradient-to-r from-indigo-50 to-blue-50', textColor: 'text-indigo-700', filterKey: 'sortBy', filterValue: 'newest' },
  { id: 'toprated', title: 'Top Rated', subtitle: 'Highest rated by users', icon: LuStar, bgGradient: 'bg-gradient-to-r from-yellow-50 to-orange-50', textColor: 'text-yellow-700', filterKey: 'sortBy', filterValue: 'rating-high' },
  { id: 'free', title: 'Free For You', subtitle: 'Download for FREE', icon: LuGift, bgGradient: 'bg-gradient-to-r from-green-50 to-emerald-50', textColor: 'text-green-700', filterKey: 'priceRange', filterValue: 'Free' },
  { id: 'mostreviewed', title: 'Most Reviewed', subtitle: 'Popular with buyers', icon: LuStar, bgGradient: 'bg-gradient-to-r from-sky-50 to-cyan-50', textColor: 'text-sky-700', filterKey: 'sortBy', filterValue: 'rating-high' },

  // ── Category: Wedding ──
  { id: 'wedding', title: 'Wedding Cards', subtitle: 'Beautiful wedding invitations', icon: LuHeart, bgGradient: 'bg-gradient-to-r from-pink-50 to-rose-50', textColor: 'text-rose-700', filterKey: 'category', filterValue: 'Wedding Card' },

  // ── Price Deals ──
  { id: 'under10', title: 'Under ₹10', subtitle: 'Super cheap finds', icon: LuTag, bgGradient: 'bg-gradient-to-r from-red-50 to-orange-50', textColor: 'text-red-700', filterKey: 'priceRange', filterValue: '0-10' },
  { id: 'discounted', title: 'On Sale', subtitle: 'Discounted designs', icon: LuPercent, bgGradient: 'bg-gradient-to-r from-rose-50 to-pink-50', textColor: 'text-rose-600', filterKey: 'sortBy', filterValue: 'price-low' },

  // ── Category Sections ──
  { id: 'visiting', title: 'Visiting Cards', subtitle: 'Professional business cards', icon: LuCreditCard, bgGradient: 'bg-gradient-to-r from-blue-50 to-indigo-50', textColor: 'text-blue-700', filterKey: 'category', filterValue: 'Visiting Card' },
  { id: 'invitation', title: 'Invitation Cards', subtitle: 'For every occasion', icon: LuMail, bgGradient: 'bg-gradient-to-r from-lime-50 to-green-50', textColor: 'text-lime-700', filterKey: 'category', filterValue: 'Invitation Card' },

  // ── More Deals ──
  { id: 'under20', title: 'Under ₹20', subtitle: 'Budget-friendly picks', icon: LuTag, bgGradient: 'bg-gradient-to-r from-orange-50 to-amber-50', textColor: 'text-orange-700', filterKey: 'priceRange', filterValue: '10-20' },
  { id: 'birthday', title: 'Birthday Banners', subtitle: 'Celebrate in style', icon: LuCake, bgGradient: 'bg-gradient-to-r from-amber-50 to-yellow-50', textColor: 'text-amber-700', filterKey: 'category', filterValue: 'Birthday Banner' },
  { id: 'festival', title: 'Festival Posts', subtitle: 'Seasonal & festival designs', icon: LuGift, bgGradient: 'bg-gradient-to-r from-purple-50 to-violet-50', textColor: 'text-purple-700', filterKey: 'category', filterValue: 'Festival Post' },

  // ── Fonts Included ──
  { id: 'withfonts', title: 'With Fonts Included', subtitle: 'Ready to use, no font hunting', icon: LuFileText, bgGradient: 'bg-gradient-to-r from-teal-50 to-cyan-50', textColor: 'text-teal-700', filterKey: 'fontsIncluded', filterValue: 'Yes' },
  { id: 'social', title: 'Social Media Posts', subtitle: 'Instagram, Facebook & more', icon: LuSmartphone, bgGradient: 'bg-gradient-to-r from-cyan-50 to-sky-50', textColor: 'text-cyan-700', filterKey: 'category', filterValue: 'Social Media Post' },
  { id: 'political', title: 'Political Banners', subtitle: 'Election & political designs', icon: LuMegaphone, bgGradient: 'bg-gradient-to-r from-red-50 to-rose-50', textColor: 'text-red-700', filterKey: 'category', filterValue: 'Political Banner' },

  // ── File Type ──
  { id: 'cdr', title: 'CorelDRAW (CDR)', subtitle: 'Ready-to-edit CDR files', icon: LuFileImage, bgGradient: 'bg-gradient-to-r from-teal-50 to-emerald-50', textColor: 'text-teal-700', filterKey: 'fileType', filterValue: 'CDR' },
  { id: 'under50', title: 'Under ₹50', subtitle: 'Great value designs', icon: LuTag, bgGradient: 'bg-gradient-to-r from-emerald-50 to-green-50', textColor: 'text-emerald-700', filterKey: 'priceRange', filterValue: '30-50' },
  { id: 'logo', title: 'Logo Designs', subtitle: 'Professional logos', icon: LuPenTool, bgGradient: 'bg-gradient-to-r from-fuchsia-50 to-pink-50', textColor: 'text-fuchsia-700', filterKey: 'category', filterValue: 'Logo Design' },
  { id: 'flyer', title: 'Business Flyers', subtitle: 'Promote your business', icon: LuFileText, bgGradient: 'bg-gradient-to-r from-slate-50 to-gray-100', textColor: 'text-slate-700', filterKey: 'category', filterValue: 'Business Flyer' },
  { id: 'psd', title: 'Photoshop (PSD)', subtitle: 'Layered PSD templates', icon: LuFileImage, bgGradient: 'bg-gradient-to-r from-indigo-50 to-blue-50', textColor: 'text-indigo-700', filterKey: 'fileType', filterValue: 'PSD' },

  // ── Premium ──
  { id: 'premium', title: 'Premium Collection', subtitle: 'Top-quality designs ₹100+', icon: LuAward, bgGradient: 'bg-gradient-to-r from-yellow-50 to-amber-50', textColor: 'text-amber-800', filterKey: 'priceRange', filterValue: '100-200' },

  // ── Budget Picks ──
  { id: 'priceLow', title: 'Budget Picks', subtitle: 'Cheapest first', icon: LuTag, bgGradient: 'bg-gradient-to-r from-gray-50 to-slate-100', textColor: 'text-gray-700', filterKey: 'sortBy', filterValue: 'price-low' },

  // ── More Categories ──
  { id: 'letterhead', title: 'Letterheads', subtitle: 'Office & business letterheads', icon: LuFile, bgGradient: 'bg-gradient-to-r from-stone-50 to-amber-50', textColor: 'text-stone-700', filterKey: 'category', filterValue: 'Letterhead' },
  { id: 'billbook', title: 'Bill Books', subtitle: 'Invoice & receipt books', icon: LuReceipt, bgGradient: 'bg-gradient-to-r from-orange-50 to-yellow-50', textColor: 'text-orange-700', filterKey: 'category', filterValue: 'Bill Book' },
  { id: 'pamphlet', title: 'Pamphlets', subtitle: 'Handbills & leaflets', icon: LuNewspaper, bgGradient: 'bg-gradient-to-r from-sky-50 to-blue-50', textColor: 'text-sky-700', filterKey: 'category', filterValue: 'Pamphlet' },
  { id: 'brochure', title: 'Brochures', subtitle: 'Multi-page brochures', icon: LuBookOpen, bgGradient: 'bg-gradient-to-r from-emerald-50 to-teal-50', textColor: 'text-emerald-700', filterKey: 'category', filterValue: 'Brochure' },
  { id: 'menu', title: 'Menu Cards', subtitle: 'Restaurant & cafe menus', icon: LuUtensils, bgGradient: 'bg-gradient-to-r from-red-50 to-orange-50', textColor: 'text-red-600', filterKey: 'category', filterValue: 'Menu Card' },
  { id: 'certificate', title: 'Certificates', subtitle: 'Achievement & award certificates', icon: LuAward, bgGradient: 'bg-gradient-to-r from-amber-50 to-yellow-50', textColor: 'text-amber-700', filterKey: 'category', filterValue: 'Certificate' },

  // ── File Types ──
  { id: 'ai', title: 'Illustrator (AI)', subtitle: 'Adobe AI vector files', icon: LuFileImage, bgGradient: 'bg-gradient-to-r from-orange-50 to-red-50', textColor: 'text-orange-700', filterKey: 'fileType', filterValue: 'AI' },
  { id: 'resume', title: 'Resume / CV', subtitle: 'Professional resume templates', icon: LuBriefcase, bgGradient: 'bg-gradient-to-r from-blue-50 to-sky-50', textColor: 'text-blue-700', filterKey: 'category', filterValue: 'Resume/CV' },
  { id: 'calendar', title: 'Calendars', subtitle: 'Annual & monthly calendars', icon: LuCalendar, bgGradient: 'bg-gradient-to-r from-violet-50 to-purple-50', textColor: 'text-violet-700', filterKey: 'category', filterValue: 'Calendar' },
  { id: 'sticker', title: 'Stickers & Labels', subtitle: 'Custom stickers & labels', icon: LuTag, bgGradient: 'bg-gradient-to-r from-pink-50 to-rose-50', textColor: 'text-pink-700', filterKey: 'category', filterValue: 'Sticker/Label' },
  { id: 'idcard', title: 'ID Cards', subtitle: 'Employee & member ID cards', icon: LuIdCard, bgGradient: 'bg-gradient-to-r from-cyan-50 to-teal-50', textColor: 'text-cyan-700', filterKey: 'category', filterValue: 'ID Card' },
  { id: 'poster', title: 'Posters', subtitle: 'Event & promotional posters', icon: LuImage, bgGradient: 'bg-gradient-to-r from-fuchsia-50 to-purple-50', textColor: 'text-fuchsia-700', filterKey: 'category', filterValue: 'Poster' },

  { id: 'pdf', title: 'PDF Templates', subtitle: 'Ready-to-print PDFs', icon: LuFile, bgGradient: 'bg-gradient-to-r from-red-50 to-rose-50', textColor: 'text-red-700', filterKey: 'fileType', filterValue: 'PDF' },
  { id: 'thumbnail', title: 'Thumbnails', subtitle: 'YouTube & video thumbnails', icon: LuImage, bgGradient: 'bg-gradient-to-r from-rose-50 to-red-50', textColor: 'text-rose-700', filterKey: 'category', filterValue: 'Thumbnail' },
  { id: 'webbanner', title: 'Web Banners', subtitle: 'Online ads & web banners', icon: LuMonitor, bgGradient: 'bg-gradient-to-r from-indigo-50 to-violet-50', textColor: 'text-indigo-700', filterKey: 'category', filterValue: 'Web Banner' },
  { id: 'infographic', title: 'Infographics', subtitle: 'Data visualization designs', icon: LuTrendingUp, bgGradient: 'bg-gradient-to-r from-teal-50 to-cyan-50', textColor: 'text-teal-700', filterKey: 'category', filterValue: 'Infographic' },
  { id: 'presentation', title: 'Presentations', subtitle: 'Slide deck templates', icon: LuProjector, bgGradient: 'bg-gradient-to-r from-blue-50 to-indigo-50', textColor: 'text-blue-600', filterKey: 'category', filterValue: 'Presentation' },
  { id: 'ebook', title: 'E-Book Covers', subtitle: 'Book & kindle covers', icon: LuBook, bgGradient: 'bg-gradient-to-r from-amber-50 to-orange-50', textColor: 'text-amber-700', filterKey: 'category', filterValue: 'E-Book Cover' },
  { id: 'tshirt', title: 'T-Shirt Designs', subtitle: 'Custom apparel graphics', icon: LuShirt, bgGradient: 'bg-gradient-to-r from-purple-50 to-fuchsia-50', textColor: 'text-purple-700', filterKey: 'category', filterValue: 'T-Shirt Design' },
  { id: 'mug', title: 'Mug Designs', subtitle: 'Custom mug prints', icon: LuCoffee, bgGradient: 'bg-gradient-to-r from-yellow-50 to-amber-50', textColor: 'text-yellow-700', filterKey: 'category', filterValue: 'Mug Design' },
  { id: 'standee', title: 'Standees', subtitle: 'Roll-up & popup standees', icon: LuLayoutTemplate, bgGradient: 'bg-gradient-to-r from-stone-50 to-gray-100', textColor: 'text-stone-700', filterKey: 'category', filterValue: 'Standee' },
  { id: 'flex', title: 'Flex Banners', subtitle: 'Large format printing', icon: LuFlag, bgGradient: 'bg-gradient-to-r from-red-50 to-rose-50', textColor: 'text-red-600', filterKey: 'category', filterValue: 'Flex Banner' },
  { id: 'envelope', title: 'Envelopes', subtitle: 'Custom envelope designs', icon: LuMailOpen, bgGradient: 'bg-gradient-to-r from-green-50 to-lime-50', textColor: 'text-green-700', filterKey: 'category', filterValue: 'Envelope' },
];

/* ─── HOME FEED COMPONENT ─── */
const HomeFeed = ({ onFilterChange }) => {
  const [sectionData, setSectionData] = useState({});
  const [feedLoading, setFeedLoading] = useState(true);

  useEffect(() => {
    setFeedLoading(true);
    api.get('/api/files/feed')
      .then(res => {
        setSectionData(res.data.sections || {});
      })
      .catch(err => console.error('Feed error:', err))
      .finally(() => setFeedLoading(false));
  }, []);

  return (
    <div className="pb-4 max-w-7xl mx-auto">
      {/* Render sections — only show those with products */}
      {FEED_SECTIONS.map(section => (
        <FeedRow
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          icon={section.icon}
          bgGradient={section.bgGradient}
          textColor={section.textColor}
          items={sectionData[section.id] || []}
          loading={feedLoading}
          onSeeAll={() => onFilterChange(section.filterKey, section.filterValue)}
        />
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const FileList = ({ refreshTrigger }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [fileType, setFileType] = useState([]);
  const [fontsIncluded, setFontsIncluded] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Is feed mode? (no filters active & no search)
  const isFeedMode = category === 'All' && priceRange === 'All' && debouncedSearch === '' &&
    fileType.length === 0 && fontsIncluded === 'All' && sortBy === 'newest';

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Track filter changes with a key to force reset
  const [refreshKey, setRefreshKey] = useState(0);

  // Reset on ANY filter change — bump refreshKey to trigger fresh fetch
  useEffect(() => {
    setFiles([]);
    setPage(1);
    setHasMore(true);
    setRefreshKey(k => k + 1);
  }, [refreshTrigger, category, priceRange, debouncedSearch, fileType, fontsIncluded, sortBy]);

  // Fetch — runs on refreshKey change (filter reset) or page change (scroll)
  // Only fetch in grid mode (when filters are active)
  useEffect(() => {
    // We want to fetch products even in feed mode to show at the bottom
    // if (isFeedMode) return; // REMOVED: Fetching for "All Products" section too
    if (priceRange === 'Custom' && !customMin && !customMax) return;

    const controller = new AbortController();
    let cancelled = false;

    const doFetch = async (pageToFetch) => {
      setLoading(true);
      try {
        let url = `/api/files?page=${pageToFetch}&limit=12&category=${category}&priceRange=${priceRange}&search=${debouncedSearch}&sort=${sortBy}`;
        if (priceRange === 'Custom') url += `&minPrice=${customMin}&maxPrice=${customMax}`;
        if (fileType.length > 0) url += `&fileType=${fileType.join(',')}`;
        if (fontsIncluded !== 'All') url += `&fontsIncluded=${fontsIncluded}`;
        const res = await api.get(url, { signal: controller.signal });
        if (cancelled) return;
        setFiles(prev => {
          const newItems = res.data.files.filter(f => !prev.some(p => p._id === f._id));
          return [...prev, ...newItems];
        });
        setHasMore(res.data.currentPage < res.data.totalPages);
      } catch (err) {
        if (!cancelled) console.error('Error fetching files:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const delay = setTimeout(() => doFetch(page), 300);
    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(delay);
    };
  }, [page, refreshKey, customMin, customMax]); // Removed isFeedMode dependency

  // Refs to avoid stale closures in IntersectionObserver
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const sentinelRef = useRef(null);
  loadingRef.current = loading;
  hasMoreRef.current = hasMore;

  // Infinite scroll observer on sentinel div
  useEffect(() => {
    // if (isFeedMode) return; // REMOVED: Allow infinite scroll in feed mode too
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
          setPage(p => p + 1);
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [files]); // Removed isFeedMode dependency

  const clearFilters = () => {
    setCategory('All');
    setPriceRange('All');
    setCustomMin('');
    setCustomMax('');
    setFileType([]);
    setFontsIncluded('All');
    setSortBy('newest');
  };

  const activeFiltersCount = [
    category !== 'All',
    priceRange !== 'All',
    fileType.length > 0,
    fontsIncluded !== 'All',
    sortBy !== 'newest',
  ].filter(Boolean).length;

  // Handle "See All" from feed sections
  const handleFeedFilterChange = (key, value) => {
    if (key === 'category') setCategory(value);
    else if (key === 'priceRange') setPriceRange(value);
    else if (key === 'fileType') setFileType([value]);
    else if (key === 'sortBy') setSortBy(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── SEARCH BAR ── */}
      <div className="bg-white border-b border-gray-100 px-3 py-2.5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
            <LuSearch className="text-gray-400 ml-3 flex-none w-4 h-4" />
            <input
              type="text"
              placeholder="Search designs, templates..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm text-gray-700 border-none outline-none bg-transparent placeholder-gray-400"
            />
            {searchTerm && (
              <button className="p-2 hover:bg-gray-100 rounded-full mr-1 transition-colors" onClick={() => setSearchTerm('')}>
                <LuX className="text-gray-400 w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CATEGORY SCROLL ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide py-2.5 px-3 gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${category === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
              >
                {React.createElement(cat === 'All' ? LuLayoutGrid : (CATEGORY_ICONS[cat] || LuBox), { className: 'w-3.5 h-3.5' })}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── FILTERS / SORT BAR ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setShowFilters(true)}
              className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeFiltersCount > 0
                ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
            >
              <LuSlidersHorizontal className="w-3 h-3" />
              Filters {activeFiltersCount > 0 && <span className="bg-indigo-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{activeFiltersCount}</span>}
            </button>

            {/* Quick sort chips */}
            <div className="hidden sm:flex items-center gap-1.5">
              {sortOptions.map(opt => (
                <button key={opt.value} onClick={() => setSortBy(opt.value)}
                  className={`flex-none px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${sortBy === opt.value
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {!isFeedMode && (
            <span className="flex-none text-xs text-gray-400 ml-2 font-medium">
              {files.length} designs
            </span>
          )}
        </div>
      </div>

      {/* ── ACTIVE FILTER CHIPS ── */}
      {activeFiltersCount > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex items-center gap-2 px-3 py-2 overflow-x-auto scrollbar-hide">
            {category !== 'All' && (
              <span className="flex-none flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                {category}
                <button onClick={() => setCategory('All')}><LuX className="w-3 h-3" /></button>
              </span>
            )}
            {priceRange !== 'All' && (
              <span className="flex-none flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                {priceRange}
                <button onClick={() => setPriceRange('All')}><LuX className="w-3 h-3" /></button>
              </span>
            )}
            {fileType.map(ft => (
              <span key={ft} className="flex-none flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                {ft}
                <button onClick={() => setFileType(prev => prev.filter(x => x !== ft))}><LuX className="w-3 h-3" /></button>
              </span>
            ))}
            {fontsIncluded !== 'All' && (
              <span className="flex-none flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                {fontsIncluded === 'Yes' ? 'With Fonts' : 'No Fonts'}
                <button onClick={() => setFontsIncluded('All')}><LuX className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearFilters} className="flex-none text-xs text-red-500 font-medium hover:text-red-600 whitespace-nowrap">
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* ── FEED MODE: Horizontal scroll sections ─────── */}
      {/* ══════════════════════════════════════════════════ */}
      {isFeedMode && (
        <HomeFeed onFilterChange={handleFeedFilterChange} />
      )}

      {/* ── GRID MODE: Filtered product grid (also shown in feed mode at bottom) ── */}
      <div className="max-w-7xl mx-auto px-3 py-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-3 border-t border-gray-100 pt-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {isFeedMode ? (
              <>
                <LuLayoutGrid className="text-indigo-600" /> All Designs
              </>
            ) : (
              category === 'All' ? 'All Designs' : category
            )}
          </h2>
          {files.length > 0 && (
            <span className="text-xs text-gray-400">{files.length} results</span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {files.map((file) => (
            <ProductCard key={file._id} file={file} />
          ))}
        </div>

        {/* Sentinel div for infinite scroll */}
        {hasMore && <div ref={sentinelRef} className="h-4" />}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8 gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            <span className="text-sm text-gray-500">Loading designs...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && files.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <LuZoomOut className="text-5xl text-gray-300 mb-3" />
            <p className="text-base font-bold text-gray-700 mb-1">No designs found</p>
            <p className="text-sm text-gray-500 mb-4">Try different filters or search keywords</p>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters}
                className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* End of results */}
        {!loading && !hasMore && files.length > 0 && (
          <div className="flex items-center justify-center py-6 gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
              All {files.length} designs shown
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
        )}
      </div>

      {/* ── FILTER BOTTOM SHEET ── */}
      <FilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        category={category} setCategory={setCategory}
        priceRange={priceRange} setPriceRange={setPriceRange}
        customMin={customMin} setCustomMin={setCustomMin}
        customMax={customMax} setCustomMax={setCustomMax}
        fileType={fileType} setFileType={setFileType}
        sortBy={sortBy} setSortBy={setSortBy}
        fontsIncluded={fontsIncluded} setFontsIncluded={setFontsIncluded}
        onClear={clearFilters}
      />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default FileList;