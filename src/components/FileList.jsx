import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
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
      const res = await axios.get(`http://localhost:5000/api/files?page=${page}&limit=12`);

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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Designs</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {files.map((file, index) => {
          const isLastElement = files.length === index + 1;
          const thumbnailLink = file.thumbnail?.viewLink
            ? `https://lh3.googleusercontent.com/d/${file.thumbnail.googleDriveId}`
            : null;

          return (
            <div
              ref={isLastElement ? lastFileElementRef : null}
              key={file._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden group">
                {thumbnailLink ? (
                  <img
                    src={thumbnailLink}
                    alt={file.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="transform transition-transform duration-300 group-hover:scale-110">
                    {getFileIcon(file.thumbnail?.mimeType || file.mimeType)}
                  </div>
                )}

                {/* Overlay with Link */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Link
                    to={`/product/${file._id}`}
                    className="bg-white text-gray-900 rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-50"
                    title="View Details"
                  >
                    <FaEye className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate" title={file.title || file.originalName}>
                    {file.title || file.originalName || 'Untitled'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-medium">
                    {file.fileType || 'Design'}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-3 border-t">
                  <span className="font-bold text-blue-600 text-lg">₹{file.price || 0}</span>
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
