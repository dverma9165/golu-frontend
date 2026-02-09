import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaFileImage, FaSearch, FaFilter, FaTimes, FaRing, FaIdCard, FaCalendarAlt, FaInstagram, FaTshirt, FaMugHot, FaCertificate, FaBullhorn, FaEye } from 'react-icons/fa';

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
  const observer = useRef();

  // Debounce Search Term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setFiles([]);
    setPage(1);
    setHasMore(true);
  }, [refreshTrigger, category, priceRange, debouncedSearch]);

  useEffect(() => {
    if (priceRange === 'Custom' && (!customMin && !customMax)) return;
    const delayDebounceFn = setTimeout(() => {
      fetchFiles();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, refreshTrigger, category, priceRange, customMin, customMax, debouncedSearch]);

  const fetchFiles = async () => {
    if (loading) return;
    setLoading(true);
    try {
      let url = `/api/files?page=${page}&limit=12&category=${category}&priceRange=${priceRange}&search=${debouncedSearch}`;
      if (priceRange === 'Custom') {
        url += `&minPrice=${customMin}&maxPrice=${customMax}`;
      }
      const res = await api.get(url);
      setFiles(prevFiles => {
        const newFiles = res.data.files.filter(newFile => !prevFiles.some(existing => existing._id === newFile._id));
        return [...prevFiles, ...newFiles];
      });
      setHasMore(res.data.currentPage < res.data.totalPages);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  const lastFileElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const getFileIcon = (mimeType) => {
    if (!mimeType) return <FaFileAlt className="text-6xl" />;
    if (mimeType.includes('pdf')) return <FaFilePdf className="text-6xl text-red-500" />;
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FaFileExcel className="text-6xl text-green-500" />;
    if (mimeType.includes('image') || mimeType.includes('photoshop')) return <FaFileImage className="text-6xl text-blue-500" />;
    return <FaFileAlt className="text-6xl text-gray-400" />;
  };

  const categories = ['Wedding Card', 'Visiting Card', 'Invitation Card', 'Birthday Banner', 'Festival Post',
    'Political Banner', 'Business Flyer', 'Social Media Post', 'Logo Design', 'Letterhead', 'Bill Book',
    'Pamphlet', 'Brochure', 'Menu Card', 'Certificate', 'Resume/CV', 'Calendar', 'Sticker/Label',
    'Envelope', 'ID Card', 'Poster', 'Thumbnail', 'Web Banner', 'Infographic', 'Presentation',
    'E-Book Cover', 'T-Shirt Design', 'Mug Design', 'Standee', 'Flex Banner', 'Other'];

  const priceRanges = [
    { value: 'All', label: 'All Prices' },
    { value: 'Free', label: 'Free' },
    { value: '0-10', label: '₹0 - ₹10' },
    { value: '10-20', label: '₹10 - ₹20' },
    { value: '20-30', label: '₹20 - ₹30' },
    { value: '30-40', label: '₹30 - ₹40' },
    { value: '40-50', label: '₹40 - ₹50' },
    { value: '50-60', label: '₹50 - ₹60' },
    { value: '60-100', label: '₹60 - ₹100' },
    { value: '100-200', label: '₹100 - ₹200' },
    { value: '200-500', label: '₹200 - ₹500' },
    { value: '500+', label: '₹500+' },
    { value: 'Custom', label: 'Custom Range' }
  ];

  const clearFilters = () => {
    setCategory('All');
    setPriceRange('All');
    setCustomMin('');
    setCustomMax('');
  };

  const activeFiltersCount = [
    category !== 'All',
    priceRange !== 'All',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header Section */}
      {/* Hero Header Section - GOD LEVEL ANIMATION */}
      <div className="relative overflow-hidden bg-slate-900 min-h-[350px] flex flex-col justify-center perspective-1000">

        {/* 1. Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br  from-indigo-900 via-purple-900 to-slate-900 opacity-90 z-0"></div>

        {/* 2. Moving Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* 3. Floating 3D Cards Background (Marquee) */}
        <div className="absolute inset-0 z-0 opacity-20 transform rotate-y-12 scale-110 pointer-events-none">
          {/* Row 1 - Left to Right */}
          <div className="flex gap-8 mb-12 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-8">
                <div className="w-64 h-40 bg-gradient-to-br from-yellow-400/80 to-orange-500/80 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
                  <FaRing className="text-4xl text-white mb-2 drop-shadow-md" />
                  <span className="text-white font-bold text-xl drop-shadow-md">Wedding Cards</span>
                </div>
                <div className="w-64 h-40 bg-gradient-to-br from-blue-400/80 to-cyan-600/80 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
                  <FaIdCard className="text-4xl text-white mb-2 drop-shadow-md" />
                  <span className="text-white font-bold text-xl drop-shadow-md">Visiting Cards</span>
                </div>
                <div className="w-64 h-40 bg-gradient-to-br from-pink-500/80 to-rose-500/80 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
                  <FaInstagram className="text-4xl text-white mb-2 drop-shadow-md" />
                  <span className="text-white font-bold text-xl drop-shadow-md">Social Media</span>
                </div>
                <div className="w-64 h-40 bg-gradient-to-br from-green-400/80 to-emerald-600/80 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
                  <FaCalendarAlt className="text-4xl text-white mb-2 drop-shadow-md" />
                  <span className="text-white font-bold text-xl drop-shadow-md">Calendars</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 - Right to Left */}
          <div className="flex gap-8 animate-marquee-reverse whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-8">
                <div className="w-64 h-40 bg-gradient-to-br from-purple-400/80 to-indigo-600/80 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
                  <FaTshirt className="text-4xl text-white mb-2 drop-shadow-md" />
                  <span className="text-white font-bold text-xl drop-shadow-md">T-Shirt Design</span>
                </div>
                <div className="w-64 h-40 bg-gradient-to-br from-red-400/80 to-orange-600/80 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
                  <FaCertificate className="text-4xl text-white mb-2 drop-shadow-md" />
                  <span className="text-white font-bold text-xl drop-shadow-md">Certificates</span>
                </div>
                <div className="w-64 h-40 bg-gradient-to-br from-amber-700/80 to-orange-900/80 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
                  <FaMugHot className="text-4xl text-white mb-2 drop-shadow-md" />
                  <span className="text-white font-bold text-xl drop-shadow-md">Mug Design</span>
                </div>
                <div className="w-64 h-40 bg-gradient-to-br from-teal-400/80 to-cyan-600/80 rounded-2xl flex flex-col items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
                  <FaBullhorn className="text-4xl text-white mb-2 drop-shadow-md" />
                  <span className="text-white font-bold text-xl drop-shadow-md">Flex Design</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Glass Overlay & Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6">
          <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white mb-6 tracking-tight drop-shadow-2xl animate-float">
            Latest Designs
          </h1>
          <p className="text-lg sm:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10 font-light leading-relaxed animate-float-delayed drop-shadow-md">
            Unlock a world of premium templates — from <span className="font-bold text-yellow-300">Wedding Cards</span> to <span className="font-bold text-pink-300">Social Media Posts</span>.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto transform transition-all hover:scale-105 duration-300">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-900/5 backdrop-blur-xl">
                <div className="pl-6 text-gray-400">
                  <FaSearch className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  placeholder="Search for shadi cards, visiting cards, logos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-4 text-lg text-gray-700 bg-transparent border-none focus:ring-0 placeholder-gray-400 font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaFilter />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* Desktop Filters */}
            <div className={`${showFilters ? 'flex' : 'hidden lg:flex'} flex-wrap items-center gap-4 w-full lg:w-auto`}>
              {/* Category Filter */}
              <div className="relative group w-full sm:w-auto">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="appearance-none w-full sm:w-64 px-5 py-3 pr-10 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-indigo-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-700 font-medium cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="relative group w-full sm:w-auto">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="appearance-none w-full sm:w-56 px-5 py-3 pr-10 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:border-indigo-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-700 font-medium cursor-pointer"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Custom Price Range */}
              {priceRange === 'Custom' && (
                <div className="flex items-center gap-3 w-full sm:w-auto bg-white px-4 py-2 rounded-xl border-2 border-indigo-200 shadow-sm">
                  <input
                    type="number"
                    placeholder="Min"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-medium"
                  />
                  <span className="text-gray-400 font-bold">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-medium"
                  />
                </div>
              )}

              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-red-600 font-medium transition-all duration-300 hover:bg-red-50 rounded-xl"
                >
                  <FaTimes />
                  Clear
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="ml-auto hidden lg:block">
              <span className="text-gray-600 font-medium">
                {files.length} {files.length === 1 ? 'Design' : 'Designs'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-3 px-1 sm:px-6 lg:px-1 py-5">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-4">
          {files.map((file, index) => {
            const isLastElement = files.length === index + 1;
            const thumbnailLink = file.thumbnail?.viewLink
              ? `https://lh3.googleusercontent.com/d/${file.thumbnail.googleDriveId}`
              : null;

            return (
              <div
                key={file._id}
                ref={isLastElement ? lastFileElementRef : null}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 h-[24rem] flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-[60%] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {thumbnailLink ? (
                    <img
                      src={thumbnailLink}
                      alt={file.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {getFileIcon(file.thumbnail?.mimeType || file.mimeType)}
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Custom Arrow Ribbon - Reference Style */}
                  <div className="absolute top-4 left-0 z-20 filter drop-shadow-lg">
                    <div
                      className="bg-white pl-4 pr-6 py-2 flex flex-col justify-center"
                      style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                    >
                      <h3 className="text-[#ED1C24] font-black text-[10px] sm:text-[11px] leading-none tracking-tighter uppercase font-sans">
                        {file.fileType === 'CDR' ? 'COREL DRAW' : file.fileType} <span className="text-black text-[12px]">{file.version}</span> TO ALL VERSION
                      </h3>
                      <p className="text-[#2E3192] font-bold text-[7px] sm:text-[8px] leading-none tracking-wider uppercase mt-1 font-sans">
                        {file.fileType} FILE {file.fontsIncluded === 'Yes' ? 'WITH FONTS FULLY EDITABLE' : 'FONTS NOT INCLUDED'}
                      </p>
                    </div>
                  </div>

                  {/* Branding Watermark */}

                  <div className="absolute bottom-3 inset-x-0 text-center z-10 pointer-events-none">
                    <span className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      DIKSHA DESIGN AND PRINT
                    </span>
                  </div>

                  {/* View Button - Centered Blob Overlay */}
                  <Link
                    to={`/product/${file._id}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30"
                  >
                    <div className="px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full shadow-2xl flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white group/btn">
                      <FaEye className="text-lg text-indigo-600 group-hover/btn:text-white transition-colors" />
                      <span className="text-sm font-bold text-gray-800 group-hover/btn:text-white transition-colors uppercase tracking-wider">
                        Quick View
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Content Area */}
                <div className="p-3 h-[40%] flex flex-col justify-between">
                  <div className="flex flex-col gap-0.5">
                    {/* Type & Category */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] uppercase font-bold tracking-wider rounded border border-indigo-100">
                        {file.fileType || 'Design'}
                      </span>
                      <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] uppercase font-bold tracking-wider rounded border border-purple-100">
                        {file.category || 'General'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-0.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {file.title || file.originalName || 'Untitled'}
                    </h3>

                    {/* Rating - Compact Line */}
                    {(file.rating || 0) > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-[10px] font-medium text-gray-500">{(file.rating).toFixed(1)} ({file.numReviews})</span>
                      </div>
                    )}
                  </div>

                  {/* Price Section */}
                  {/* Price Section - Compact */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <div>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        {file.salePrice && file.salePrice < file.price ? (
                          <>
                            <span className="text-lg font-extrabold text-indigo-600">
                              ₹{file.salePrice}
                            </span>
                            <span className="text-xs text-gray-400 line-through decoration-red-400/50">
                              ₹{file.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-extrabold text-gray-900">
                            ₹{file.salePrice || file.price || 0}
                          </span>
                        )}
                      </div>

                      {/* Savings Badge */}
                      {file.salePrice && file.salePrice < file.price && (
                        <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 inline-block">
                          Save ₹{file.price - file.salePrice} ({Math.round(((file.price - file.salePrice) / file.price) * 100)}%)
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/product/${file._id}`}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide shadow hover:bg-indigo-700 transition-all"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && files.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No designs found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* End of Results */}
        {!loading && !hasMore && files.length > 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">You've reached the end</span>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList;