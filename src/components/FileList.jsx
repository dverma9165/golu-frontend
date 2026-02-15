import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  LuHeart, LuCreditCard, LuCake, LuGift, LuTag, LuSmartphone,
  LuMegaphone, LuFileImage, LuPenTool, LuFileText, LuAward,
  LuStar, LuMail, LuFile, LuReceipt, LuNewspaper, LuBookOpen,
  LuUtensils, LuBriefcase, LuCalendar, LuIdCard, LuImage,
  LuMonitor, LuTrendingUp, LuProjector, LuBook, LuShirt,
  LuCoffee, LuLayoutTemplate, LuFlag, LuMailOpen, LuPercent,
  LuSearch, LuX, LuChevronDown, LuSlidersHorizontal, LuZoomOut,
  LuBox, LuLayoutGrid, LuCircleUser, LuListFilter
} from 'react-icons/lu';

/* ─── CONSTANTS ─── */
const CATEGORY_ICONS = {
  'Free': LuGift,
  'Wedding Card': LuHeart, 'Visiting Card': LuCreditCard, 'Invitation Card': LuMail,
  'Birthday Banner': LuCake, 'Festival Post': LuGift, 'Political Banner': LuMegaphone,
  'Business Flyer': LuFileText, 'Social Media Post': LuSmartphone, 'Logo Design': LuPenTool,
  'Letterhead': LuFile, 'Bill Book': LuReceipt, 'Pamphlet': LuNewspaper,
  'Brochure': LuBookOpen, 'Menu Card': LuUtensils, 'Certificate': LuAward,
  'Resume/CV': LuBriefcase, 'Calendar': LuCalendar, 'Calendar Design': LuCalendar, 'Sticker/Label': LuTag,
  'Envelope': LuMailOpen, 'ID Card': LuIdCard, 'Poster': LuImage,
  'Thumbnail': LuImage, 'Web Banner': LuMonitor, 'Infographic': LuTrendingUp,
  'Presentation': LuProjector, 'E-Book Cover': LuBook, 'T-Shirt Design': LuShirt,
  'Mug Design': LuCoffee, 'Standee': LuLayoutTemplate, 'Flex Banner': LuFlag, 'Other': LuBox,
};

const CATEGORY_KEYS = {
  'Free': 'free',
  'Wedding Card': 'weddingCards', 'Visiting Card': 'visitingCards', 'Invitation Card': 'invitationCards',
  'Birthday Banner': 'birthdayBanners', 'Festival Post': 'festivalPosts', 'Political Banner': 'politicalBanners',
  'Business Flyer': 'businessFlyers', 'Social Media Post': 'socialMediaPosts', 'Logo Design': 'logoDesigns',
  'Letterhead': 'letterheads', 'Bill Book': 'billBooks', 'Pamphlet': 'pamphlets',
  'Brochure': 'brochures', 'Menu Card': 'menuCards', 'Certificate': 'certificates',
  'Resume/CV': 'resumeCv', 'Calendar': 'calendars', 'Sticker/Label': 'stickersLabels',
  'Envelope': 'envelopes', 'ID Card': 'idCards', 'Poster': 'posters',
  'Thumbnail': 'thumbnails', 'Web Banner': 'webBanners', 'Infographic': 'infographics',
  'Presentation': 'presentations', 'E-Book Cover': 'ebookCovers', 'T-Shirt Design': 'tshirtDesigns',
  'Mug Design': 'mugDesigns', 'Standee': 'standees', 'Flex Banner': 'flexBanners', 'Other': 'all',
};

const getCategories = (t) => ['All', 'Free', ...Object.keys(CATEGORY_ICONS).filter(k => k !== 'Free')];

const getPriceRanges = (t) => [
  { value: 'All', label: t('allPrices') },
  { value: 'Free', label: t('free') },
  { value: '0-10', label: t('under10') },
  { value: '10-20', label: t('under20') },
  { value: '20-30', label: '₹20–₹30' },
  { value: '30-50', label: t('under50') },
  { value: '50-100', label: '₹50–₹100' },
  { value: '100-200', label: '₹100–₹200' },
  { value: '200-500', label: '₹200–₹500' },
  { value: '500+', label: '₹500+' },
  { value: 'Custom', label: t('customPrice') },
];

const fileTypes = ['CDR', 'PSD', 'AI', 'PDF', 'EPS', 'INDD', 'SVG', 'PNG', 'JPG'];

const getSortOptions = (t) => [
  { value: 'newest', label: t('newest') },
  { value: 'oldest', label: t('oldest') },
  { value: 'price-low', label: t('priceLow') },
  { value: 'price-high', label: t('priceHigh') },
  { value: 'rating-high', label: t('topRated') },
];

/* ─── HELPERS ─── */
const discount = (price, sale) =>
  price && sale && sale < price ? Math.round(((price - sale) / price) * 100) : null;

/* ─── PRODUCT CARD ─── */
const ProductCard = ({ file }) => {
  const { t } = useLanguage();
  const thumb = file.thumbnail?.googleDriveId
    ? `${import.meta.env.VITE_DRIVE_URL_PREFIX || 'https://drive.google.com/thumbnail?id='}${file.thumbnail.googleDriveId}`
    : null;
  const disc = discount(file.price, file.salePrice);
  const displayPrice = file.salePrice ?? file.price ?? 0;
  const savedAmount = file.price && file.salePrice ? file.price - file.salePrice : 0;
  const categoryLabel = t(CATEGORY_KEYS[file.category] || file.category) || file.category;

  return (
    <Link
      to={`/product/${file._id}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 "
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
            {disc}% {t('off')}
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
      <div className="p-2.5">
        <p className="text-xs text-indigo-500 font-medium truncate">{categoryLabel}</p>
        <p
          className="text-[15px] font-bold text-gray-800 leading-tight mt-1 line-clamp-2 min-h-[2.5em]"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          title={file.title}
        >
          {file.title || t('untitled')}
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
            {displayPrice === 0 ? t('free') : `₹${displayPrice}`}
          </span>
          {disc && (
            <span className="text-xs text-gray-400 line-through">₹{file.price}</span>
          )}
          {savedAmount > 0 && (
            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded ml-auto">
              {t('save')} ₹{savedAmount}
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
}) => {
  const { t } = useLanguage();
  const categories = getCategories(t);
  const priceRanges = getPriceRanges(t);
  const sortOptions = getSortOptions(t);

  return (
    <>
      {visible && <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" onClick={onClose} />}
      <div
        className="fixed bottom-0 left-0 right-0 z-[60] bg-white rounded-t-2xl transition-transform duration-300 overflow-y-auto"
        style={{ maxHeight: '80vh', transform: visible ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">{t('filters')} & {t('sortBy')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <LuX className="text-gray-500 w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-4 space-y-5">
          {/* Sort */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('sortBy')}</p>
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
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('category')}</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${category === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}>
                  {t(CATEGORY_KEYS[cat] || cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('priceRange')}</p>
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
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('fileType')}</p>
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
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{t('fontsIncluded')}</p>
            <div className="flex gap-2">
              {['All', 'Yes', 'No'].map(f => (
                <button key={f} onClick={() => setFontsIncluded(f)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${fontsIncluded === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}>
                  {f === 'All' ? t('all') : f === 'Yes' ? t('withFontsLabel') : t('noFontsLabel')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 flex gap-3 border-t border-gray-100">
          <button onClick={onClear}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            {t('clearAll')}
          </button>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            {t('applyFilters')}
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── FEED SECTION CARD (horizontal scroll) ─── */
const FeedCard = ({ file }) => {
  const { t } = useLanguage();
  const thumb = file.thumbnail?.googleDriveId
    ? `${import.meta.env.VITE_DRIVE_URL_PREFIX || 'https://drive.google.com/thumbnail?id='}${file.thumbnail.googleDriveId}`
    : null;
  const disc = discount(file.price, file.salePrice);
  const displayPrice = file.salePrice ?? file.price ?? 0;
  const savedAmount = file.price && file.salePrice ? file.price - file.salePrice : 0;

  return (
    <Link
      to={`/product/${file._id}`}
      className="flex-none w-40 sm:w-44 bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 group flex flex-col h-full"
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
      <div className="p-2.5 flex flex-col flex-1">
        <p className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2 h-9" title={file.title}>{file.title || t('untitled')}</p>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-base font-bold text-gray-900">{displayPrice === 0 ? t('free') : `₹${displayPrice}`}</span>
          {disc && <span className="text-xs text-gray-400 line-through">₹{file.price}</span>}
          {savedAmount > 0 && (
            <span className="text-[10px] font-bold text-green-700 ml-auto">
              {t('save')} ₹{savedAmount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ─── HORIZONTAL SCROLL ROW ─── */
const FeedRow = ({ title, subtitle, icon: Icon, bgGradient, textColor, items, onSeeAll, loading: rowLoading }) => {
  const { t } = useLanguage();
  const scrollRef = useRef(null);

  if (!rowLoading && (!items || items.length === 0)) return null;

  return (
    <div className={`mb-2 pb-1 ${bgGradient || 'bg-white'} rounded-xl mx-2 sm:mx-0 overflow-hidden shadow-sm border border-gray-100/50`}>
      {/* Section Header */}
      <div className="px-3 py-2 flex items-center justify-between">
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
            {t('seeAll')} →
          </button>
        )}
      </div>
      {/* Scrollable Row */}
      <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 bg-transparent snap-x items-stretch px-0">
        <div className="w-0 shrink-0" />
        {rowLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-none w-44 sm:w-48 rounded-xl bg-white/60 animate-pulse snap-start" style={{ height: 220 }} />
          ))
        ) : (
          items.map((file, index) => (
            /* Add left margin to first item if needed, but px-3 on container should suffice. 
               However, to be robust against flex padding issues, we can use ps-1 or similar if implied? 
               No, px-3 should work. */
            <div key={file._id} className="snap-start flex"><FeedCard file={file} /></div>
          ))
        )}
        <div className="w-0 shrink-0" />
      </div>
    </div>
  );
};



/* ─── FEED SECTIONS DEFINITIONS (Dynamic) ─── */
const getFeedSections = (t) => [
  // ── Curated / Smart Sections ──
  { id: 'newest', title: t('justArrived'), subtitle: t('freshDesigns'), icon: LuGift, bgGradient: 'bg-gradient-to-r from-indigo-100 to-blue-100', textColor: 'text-indigo-900', filterKey: 'sortBy', filterValue: 'newest' },
  { id: 'toprated', title: t('topRated'), subtitle: t('highestRated'), icon: LuStar, bgGradient: 'bg-gradient-to-r from-yellow-100 to-orange-100', textColor: 'text-yellow-800', filterKey: 'sortBy', filterValue: 'rating-high' },
  { id: 'free', title: t('freeForYou'), subtitle: t('downloadFree'), icon: LuGift, bgGradient: 'bg-gradient-to-r from-green-100 to-emerald-100', textColor: 'text-green-800', filterKey: 'priceRange', filterValue: 'Free' },
  { id: 'mostreviewed', title: t('mostReviewed'), subtitle: t('popularWithBuyers'), icon: LuStar, bgGradient: 'bg-gradient-to-r from-sky-100 to-cyan-100', textColor: 'text-sky-800', filterKey: 'sortBy', filterValue: 'rating-high' },

  // ── Category: Wedding ──
  { id: 'wedding', title: t('weddingCards'), subtitle: t('weddingSubtitle'), icon: LuHeart, bgGradient: 'bg-gradient-to-r from-pink-100 to-rose-100', textColor: 'text-rose-800', filterKey: 'category', filterValue: 'Wedding Card' },

  // ── Price Deals ──
  { id: 'under10', title: t('under10'), subtitle: t('cheapFinds'), icon: LuTag, bgGradient: 'bg-gradient-to-r from-red-100 to-orange-100', textColor: 'text-red-800', filterKey: 'priceRange', filterValue: '0-10' },
  { id: 'discounted', title: t('onSale'), subtitle: t('discountedDesigns'), icon: LuPercent, bgGradient: 'bg-gradient-to-r from-rose-100 to-pink-100', textColor: 'text-rose-700', filterKey: 'sortBy', filterValue: 'price-low' },

  // ── Category Sections ──
  { id: 'visiting', title: t('visitingCards'), subtitle: t('businessCards'), icon: LuCreditCard, bgGradient: 'bg-gradient-to-r from-blue-100 to-indigo-100', textColor: 'text-blue-800', filterKey: 'category', filterValue: 'Visiting Card' },
  { id: 'invitation', title: t('invitationCards'), subtitle: t('everyOccasion'), icon: LuMail, bgGradient: 'bg-gradient-to-r from-lime-100 to-green-100', textColor: 'text-lime-800', filterKey: 'category', filterValue: 'Invitation Card' },

  // ── More Deals ──
  { id: 'under20', title: t('under20'), subtitle: t('cheapFinds'), icon: LuTag, bgGradient: 'bg-gradient-to-r from-orange-100 to-amber-100', textColor: 'text-orange-800', filterKey: 'priceRange', filterValue: '10-20' },
  { id: 'birthday', title: t('birthdayBanners'), subtitle: t('celebrateStyle'), icon: LuCake, bgGradient: 'bg-gradient-to-r from-amber-100 to-yellow-100', textColor: 'text-amber-800', filterKey: 'category', filterValue: 'Birthday Banner' },
  { id: 'festival', title: t('festivalPosts'), subtitle: t('seasonalDesigns'), icon: LuGift, bgGradient: 'bg-gradient-to-r from-purple-100 to-violet-100', textColor: 'text-purple-800', filterKey: 'category', filterValue: 'Festival Post' },

  // ── Fonts Included ──
  { id: 'withfonts', title: t('withFonts'), subtitle: t('readyToUse'), icon: LuFileText, bgGradient: 'bg-gradient-to-r from-teal-100 to-cyan-100', textColor: 'text-teal-800', filterKey: 'fontsIncluded', filterValue: 'Yes' },
  { id: 'social', title: t('socialMediaPosts'), subtitle: t('instaFacebook'), icon: LuSmartphone, bgGradient: 'bg-gradient-to-r from-cyan-100 to-sky-100', textColor: 'text-cyan-800', filterKey: 'category', filterValue: 'Social Media Post' },
  { id: 'political', title: t('politicalBanners'), subtitle: t('electionDesigns'), icon: LuMegaphone, bgGradient: 'bg-gradient-to-r from-red-100 to-rose-100', textColor: 'text-red-800', filterKey: 'category', filterValue: 'Political Banner' },

  // ── File Type ──
  { id: 'cdr', title: t('corelDraw'), subtitle: t('readyToEdit'), icon: LuFileImage, bgGradient: 'bg-gradient-to-r from-teal-100 to-emerald-100', textColor: 'text-teal-800', filterKey: 'fileType', filterValue: 'CDR' },
  { id: 'under50', title: t('under50'), subtitle: t('cheapFinds'), icon: LuTag, bgGradient: 'bg-gradient-to-r from-emerald-100 to-green-100', textColor: 'text-emerald-800', filterKey: 'priceRange', filterValue: '30-50' },
  { id: 'logo', title: t('logoDesigns'), subtitle: t('professionalLogos'), icon: LuPenTool, bgGradient: 'bg-gradient-to-r from-fuchsia-100 to-pink-100', textColor: 'text-fuchsia-800', filterKey: 'category', filterValue: 'Logo Design' },
  { id: 'flyer', title: t('businessFlyers'), subtitle: t('promoteBusiness'), icon: LuFileText, bgGradient: 'bg-gradient-to-r from-slate-100 to-gray-200', textColor: 'text-slate-800', filterKey: 'category', filterValue: 'Business Flyer' },
  { id: 'psd', title: t('photoshop'), subtitle: t('layeredPsd'), icon: LuFileImage, bgGradient: 'bg-gradient-to-r from-indigo-100 to-blue-100', textColor: 'text-indigo-800', filterKey: 'fileType', filterValue: 'PSD' },

  // ── Premium ──
  { id: 'premium', title: t('premiumCollection'), subtitle: t('topQuality'), icon: LuAward, bgGradient: 'bg-gradient-to-r from-yellow-100 to-amber-100', textColor: 'text-amber-900', filterKey: 'priceRange', filterValue: '100-200' },

  // ── Budget Picks ──
  { id: 'priceLow', title: t('budgetPicks'), subtitle: t('cheapestFirst'), icon: LuTag, bgGradient: 'bg-gradient-to-r from-gray-100 to-slate-200', textColor: 'text-gray-800', filterKey: 'sortBy', filterValue: 'price-low' },

  // ── More Categories ──
  { id: 'letterhead', title: t('letterheads'), subtitle: t('officeBusiness'), icon: LuFile, bgGradient: 'bg-gradient-to-r from-stone-100 to-amber-100', textColor: 'text-stone-800', filterKey: 'category', filterValue: 'Letterhead' },
  { id: 'billbook', title: t('billBooks'), subtitle: t('invoiceReceipt'), icon: LuReceipt, bgGradient: 'bg-gradient-to-r from-orange-100 to-yellow-100', textColor: 'text-orange-800', filterKey: 'category', filterValue: 'Bill Book' },
  { id: 'pamphlet', title: t('pamphlets'), subtitle: t('handbills'), icon: LuNewspaper, bgGradient: 'bg-gradient-to-r from-sky-100 to-blue-100', textColor: 'text-sky-800', filterKey: 'category', filterValue: 'Pamphlet' },
  { id: 'brochure', title: t('brochures'), subtitle: t('multiPage'), icon: LuBookOpen, bgGradient: 'bg-gradient-to-r from-emerald-100 to-teal-100', textColor: 'text-emerald-800', filterKey: 'category', filterValue: 'Brochure' },
  { id: 'menu', title: t('menuCards'), subtitle: t('restaurantMenus'), icon: LuUtensils, bgGradient: 'bg-gradient-to-r from-red-100 to-orange-100', textColor: 'text-red-700', filterKey: 'category', filterValue: 'Menu Card' },
  { id: 'certificate', title: t('certificates'), subtitle: t('achievementAwards'), icon: LuAward, bgGradient: 'bg-gradient-to-r from-amber-100 to-yellow-100', textColor: 'text-amber-800', filterKey: 'category', filterValue: 'Certificate' },

  // ── File Types ──
  { id: 'ai', title: t('illustrator'), subtitle: t('vectorFiles'), icon: LuFileImage, bgGradient: 'bg-gradient-to-r from-orange-100 to-red-100', textColor: 'text-orange-800', filterKey: 'fileType', filterValue: 'AI' },
  { id: 'resume', title: t('resumeCv'), subtitle: t('professionalResumes'), icon: LuBriefcase, bgGradient: 'bg-gradient-to-r from-blue-100 to-sky-100', textColor: 'text-blue-800', filterKey: 'category', filterValue: 'Resume/CV' },
  { id: 'calendar', title: t('calendars'), subtitle: t('annualMonthly'), icon: LuCalendar, bgGradient: 'bg-gradient-to-r from-violet-100 to-purple-100', textColor: 'text-violet-800', filterKey: 'category', filterValue: 'Calendar' },
  { id: 'sticker', title: t('stickersLabels'), subtitle: t('customLabels'), icon: LuTag, bgGradient: 'bg-gradient-to-r from-pink-100 to-rose-100', textColor: 'text-pink-800', filterKey: 'category', filterValue: 'Sticker/Label' },
  { id: 'idcard', title: t('idCards'), subtitle: t('employeeCards'), icon: LuIdCard, bgGradient: 'bg-gradient-to-r from-cyan-100 to-teal-100', textColor: 'text-cyan-800', filterKey: 'category', filterValue: 'ID Card' },
  { id: 'poster', title: t('posters'), subtitle: t('eventPromotional'), icon: LuImage, bgGradient: 'bg-gradient-to-r from-fuchsia-100 to-purple-100', textColor: 'text-fuchsia-800', filterKey: 'category', filterValue: 'Poster' },

  { id: 'pdf', title: t('pdfTemplates'), subtitle: t('readyPrint'), icon: LuFile, bgGradient: 'bg-gradient-to-r from-red-100 to-rose-100', textColor: 'text-red-800', filterKey: 'fileType', filterValue: 'PDF' },
  { id: 'thumbnail', title: t('thumbnails'), subtitle: t('youtubeVideo'), icon: LuImage, bgGradient: 'bg-gradient-to-r from-rose-100 to-red-100', textColor: 'text-rose-800', filterKey: 'category', filterValue: 'Thumbnail' },
  { id: 'webbanner', title: t('webBanners'), subtitle: t('onlineAds'), icon: LuMonitor, bgGradient: 'bg-gradient-to-r from-indigo-100 to-violet-100', textColor: 'text-indigo-800', filterKey: 'category', filterValue: 'Web Banner' },
  { id: 'infographic', title: t('infographics'), subtitle: t('dataViz'), icon: LuTrendingUp, bgGradient: 'bg-gradient-to-r from-teal-100 to-cyan-100', textColor: 'text-teal-800', filterKey: 'category', filterValue: 'Infographic' },
  { id: 'presentation', title: t('presentations'), subtitle: t('slideDecks'), icon: LuProjector, bgGradient: 'bg-gradient-to-r from-blue-100 to-indigo-100', textColor: 'text-blue-700', filterKey: 'category', filterValue: 'Presentation' },
  { id: 'ebook', title: t('ebookCovers'), subtitle: t('bookKindle'), icon: LuBook, bgGradient: 'bg-gradient-to-r from-amber-100 to-orange-100', textColor: 'text-amber-800', filterKey: 'category', filterValue: 'E-Book Cover' },
  { id: 'tshirt', title: t('tshirtDesigns'), subtitle: t('apparelGraphics'), icon: LuShirt, bgGradient: 'bg-gradient-to-r from-purple-100 to-fuchsia-100', textColor: 'text-purple-800', filterKey: 'category', filterValue: 'T-Shirt Design' },
  { id: 'mug', title: t('mugDesigns'), subtitle: t('customMugs'), icon: LuCoffee, bgGradient: 'bg-gradient-to-r from-yellow-100 to-amber-100', textColor: 'text-yellow-800', filterKey: 'category', filterValue: 'Mug Design' },
  { id: 'standee', title: t('standees'), subtitle: t('rollUpPopup'), icon: LuLayoutTemplate, bgGradient: 'bg-gradient-to-r from-stone-100 to-gray-200', textColor: 'text-stone-800', filterKey: 'category', filterValue: 'Standee' },
  { id: 'flex', title: t('flexBanners'), subtitle: t('largeFormat'), icon: LuFlag, bgGradient: 'bg-gradient-to-r from-red-100 to-rose-100', textColor: 'text-red-700', filterKey: 'category', filterValue: 'Flex Banner' },
  { id: 'envelope', title: t('envelopes'), subtitle: t('customEnvelopes'), icon: LuMailOpen, bgGradient: 'bg-gradient-to-r from-green-100 to-lime-100', textColor: 'text-green-800', filterKey: 'category', filterValue: 'Envelope' },
];

/* ─── HOME FEED COMPONENT ─── */
const HomeFeed = ({ onFilterChange }) => {
  const [sectionData, setSectionData] = useState({});
  const [feedLoading, setFeedLoading] = useState(true);
  const { t } = useLanguage();
  const feedSections = React.useMemo(() => getFeedSections(t), [t]);

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
    <div className="pb-0 w-full">
      {/* Render sections — only show those with products */}
      {feedSections.map(section => (
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

/* ─── MAIN COMPONENT ─── */
const FileList = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [fileType, setFileType] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [fontsIncluded, setFontsIncluded] = useState('All');

  // Custom Price Range
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');

  // View state
  const [viewMode, setViewMode] = useState('feed'); // 'feed' or 'grid'

  // Mobile Bottom Sheet
  const [filterVisible, setFilterVisible] = useState(false);

  const observer = useRef();
  const lastFileElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // URL Parameter Handling
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sortParam = params.get('sort');
    const catParam = params.get('category');
    const priceParam = params.get('priceRange');

    if (sortParam) setSortBy(sortParam);
    if (catParam) setCategory(catParam);
    if (priceParam) setPriceRange(priceParam);

    // If any filter is applied via URL, ensure we switch to grid view if needed
    if (sortParam || catParam || priceParam) {
      setViewMode('grid');
    }
  }, [location.search]);

  // Fetch logic
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {
      page,
      limit: 12,
      search,
      category: category !== 'All' ? category : undefined,
      sortBy,
      fontsIncluded: fontsIncluded !== 'All' ? fontsIncluded : undefined,
    };

    if (priceRange !== 'All') {
      params.priceRange = priceRange;

      if (priceRange === 'Custom') {
        if (customMin) params.minPrice = customMin;
        if (customMax) params.maxPrice = customMax;
      }
    }

    if (fileType.length > 0) {
      params.fileType = fileType.join(',');
    }

    api.get('/api/files', { params })
      .then(res => {
        setFiles(prev => page === 1 ? res.data.files : [...prev, ...res.data.files]);
        setHasMore(res.data.files.length > 0 && res.data.currentPage < res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching files:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [page, search, category, priceRange, customMin, customMax, fileType, sortBy, fontsIncluded]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setFiles([]);
  }, [search, category, priceRange, customMin, customMax, fileType, sortBy, fontsIncluded]);


  /* ─── HANDLERS ─── */
  const handleFilterChange = (key, value) => {
    // Reset other filters to default when tailored section clicked
    setCategory('All');
    setPriceRange('All');
    setFileType([]);
    setSortBy('newest');
    setFontsIncluded('All');

    // Apply specific
    if (key === 'category') {
      if (value === 'Free') {
        setPriceRange('Free');
        setCategory('All');
      } else {
        setCategory(value);
      }
    }
    if (key === 'priceRange') setPriceRange(value);
    if (key === 'sortBy') setSortBy(value);
    if (key === 'fileType') setFileType([value]);
    if (key === 'fontsIncluded') setFontsIncluded(value);

    // Switch to grid view
    setViewMode('grid');

    // Scroll to top of list container
    document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setPriceRange('All');
    setFileType([]);
    setCustomMin('');
    setCustomMax('');
    setSortBy('newest');
    setFontsIncluded('All');
    setFilterVisible(false);
    setViewMode('feed');
  };

  const activeFiltersCount = [
    category !== 'All',
    priceRange !== 'All',
    fileType.length > 0,
    sortBy !== 'newest',
    fontsIncluded !== 'All'
  ].filter(Boolean).length;

  const categories = getCategories(t);

  return (
    <div className="space-y-2">
      {/* Search & Filter Bar */}
      <div className="sticky top-14 z-30 bg-slate-50/95 backdrop-blur-sm py-1.5 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1 group">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white shadow-sm ring-1 ring-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-gray-400 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setFilterVisible(true)}
            className={`px-4 rounded-xl flex items-center gap-2 font-semibold shadow-sm transition-all text-sm ${activeFiltersCount > 0
              ? 'bg-indigo-600 text-white ring-0'
              : 'bg-white text-gray-600 ring-1 ring-gray-100 hover:bg-gray-50'
              }`}
          >
            <LuListFilter className="w-5 h-5" />
            <span className="hidden sm:inline">{t('filters')}</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs backdrop-blur-sm">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mask-linear-fade">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat];
            const isActive = category === cat || (cat === 'Free' && priceRange === 'Free');
            const label = t(CATEGORY_KEYS[cat] || cat);

            return (
              <button
                key={cat}
                onClick={() => handleFilterChange('category', cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${isActive
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-300' : 'text-slate-400'}`} />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Show Feed Sections ONLY if on first page & no active filters (except default sort) */}
      {/* Actually show feed sections if Category is All and Search is empty */}
      {category === 'All' && search === '' && priceRange === 'All' && fileType.length === 0 && fontsIncluded === 'All' && page === 1 && viewMode === 'feed' && (
        <HomeFeed onFilterChange={handleFilterChange} />
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {files.map((file, index) => {
          if (files.length === index + 1) {
            return <div ref={lastFileElementRef} key={file._id}><ProductCard file={file} /></div>;
          } else {
            return <div key={file._id}><ProductCard file={file} /></div>;
          }
        })}
      </div>

      {/* Loaders & States */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!loading && files.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <LuSearch className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{t('noDesignsFound')}</h3>
          <p className="text-slate-500 mt-1">{t('tryFilters')}</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            {t('clearAll')}
          </button>
          <button
            onClick={() => {
              clearFilters();
              setViewMode('feed');
            }}
            className="mt-4 ml-4 px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            {t('home')}
          </button>
        </div>
      )}

      {!loading && !hasMore && files.length > 0 && (
        <div className="text-center py-10">
          <p className="text-slate-400 text-sm font-medium bg-slate-50 inline-block px-4 py-1 rounded-full">{t('allDesignsShown')}</p>
        </div>
      )}

      <FilterSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
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
        .mask-linear-fade { mask-image: linear-gradient(to right, black 90%, transparent 100%); -webkit-mask-image: linear-gradient(to right, black 90%, transparent 100%); }
      `}</style>
    </div>
  );
};

export default FileList;