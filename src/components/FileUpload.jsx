import React, { useState, useRef } from 'react';
import api from '../services/api';
import { FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaFileAlt, FaImage } from 'react-icons/fa';

const FileUpload = ({ onUploadSuccess, adminPassword }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [fileType, setFileType] = useState('CDR');
  const [fontsIncluded, setFontsIncluded] = useState('Yes');

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!thumbnail || !sourceFile || !title || !price) {
      setMessage('Please fill required fields and select both files.');
      return;
    }

    const formData = new FormData();
    formData.append('thumbnail', thumbnail);
    formData.append('sourceFile', sourceFile);
    formData.append('title', title);
    formData.append('price', price);
    formData.append('salePrice', salePrice);
    formData.append('description', description);
    formData.append('version', version);
    formData.append('fileType', fileType);
    formData.append('fontsIncluded', fontsIncluded);

    setUploading(true);
    setMessage('');

    try {
      await api.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-admin-password': adminPassword
        },
      });
      setMessage('Product created successfully!');
      // Reset Form
      setThumbnail(null);
      setSourceFile(null);
      setTitle('');
      setPrice('');
      setSalePrice('');
      setDescription('');

      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error(err);
      setMessage('Failed to upload. ' + (err.response?.data?.msg || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gray-800 text-white px-8 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaCloudUploadAlt /> Create New Product
        </h2>
      </div>

      <div className="p-8">
        <form onSubmit={handleUpload} className="space-y-6">

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Wedding Invitation Card" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">File Type</label>
              <select value={fileType} onChange={e => setFileType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                <option>CDR</option>
                <option>PSD</option>
                <option>AI</option>
                <option>PDF</option>
                <option>ZIP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Price (Optional)</label>
              <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Version</label>
              <input type="text" value={version} onChange={e => setVersion(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. X5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fonts Included?</label>
              <select value={fontsIncluded} onChange={e => setFontsIncluded(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500" placeholder="Product details..."></textarea>
          </div>

          {/* File Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            {/* Thumbnail Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-white transition-colors">
              <FaImage className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-700 mb-2">Thumbnail Image (Public)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {thumbnail && <p className="text-xs text-green-600 mt-2">{thumbnail.name}</p>}
            </div>

            {/* Source File Upload */}
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 flex flex-col items-center justify-center bg-blue-50 hover:bg-white transition-colors">
              <FaFileAlt className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-sm font-medium text-gray-700 mb-2">Main File (Private/Secure)</span>
              <input
                type="file"
                onChange={(e) => setSourceFile(e.target.files[0])}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
              {sourceFile && <p className="text-xs text-green-600 mt-2">{sourceFile.name}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`mt-4 w-full py-3 px-6 rounded-lg text-white font-bold shadow-md transition-all
                    ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black'}
                `}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Uploading to Drive (Takes time)...
              </span>
            ) : (
              'Publish Product'
            )}
          </button>
          {message && (
            <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium w-full text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default FileUpload;
