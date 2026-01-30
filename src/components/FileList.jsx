import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaFilePdf, FaFileExcel, FaFileImage, FaFileAlt, FaEye } from 'react-icons/fa';

const FileList = ({ refreshTrigger }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    setFiles([]);
    setPage(1);
    setHasMore(true);
  }, [refreshTrigger]);

  useEffect(() => {
    fetchFiles();
  }, [page, refreshTrigger]);

  const fetchFiles = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/files?page=${page}&limit=12`);

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

  // Logic adapted for Product Model
  const getFileIcon = (mimeType) => {
    if (!mimeType) return <FaFileAlt className="text-gray-400 w-10 h-10" />;
    if (mimeType.includes('pdf')) return <FaFilePdf className="text-red-500 w-10 h-10" />;
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return <FaFileExcel className="text-green-500 w-10 h-10" />;
    if (mimeType.includes('image') || mimeType.includes('photoshop')) return <FaFileImage className="text-purple-500 w-10 h-10" />;
    return <FaFileAlt className="text-gray-400 w-10 h-10" />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 font-display">Latest Designs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {files.map((file, index) => {
          const isLastElement = files.length === index + 1;
          const thumbnailLink = file.thumbnail?.viewLink
            ? `https://lh3.googleusercontent.com/d/${file.thumbnail.googleDriveId}`
            : null;

          return (
            <div
              ref={isLastElement ? lastFileElementRef : null}
              key={file._id}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-slate-100 flex flex-col relative"
            >
              {/* Image Container */}
              <div className="h-64 bg-slate-100 relative overflow-hidden">
                {thumbnailLink ? (
                  <img
                    src={thumbnailLink}
                    alt={file.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 group-hover:scale-105 transition-transform duration-500">
                    {getFileIcon(file.thumbnail?.mimeType || file.mimeType)}
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Floating Action Button (Glassmorphism) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <Link
                    to={`/product/${file._id}`}
                    className="glass text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-lg backdrop-blur-md"
                  >
                    <FaEye /> View Details
                  </Link>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-white relative z-10">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase bg-indigo-50 px-2 py-1 rounded-md">
                      {file.fileType || 'Design'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2" title={file.title || file.originalName}>
                    {file.title || file.originalName || 'Untitled'}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium uppercase">Price</span>
                    <span className="font-extrabold text-2xl text-slate-900">₹{file.price || 0}</span>
                  </div>
                  <Link
                    to={`/product/${file._id}`}
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 group-hover:rotate-45"
                  >
                    <FaEye />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default FileList;
