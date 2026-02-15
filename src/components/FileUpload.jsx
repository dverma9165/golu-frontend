import React, { useState, useRef } from 'react';
import api from '../services/api';
import { FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaFileAlt, FaImage } from 'react-icons/fa';

const FILE_TYPES_DATA = {
  "fileTypes": [
    {
      "parent": "CDR",
      "children": [
        "9", "10", "11", "12", "X3", "X4", "X5", "X6", "X7", "X8",
        "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"
      ]
    },
    {
      "parent": "AI",
      "children": [
        "8", "9", "10", "CS", "CS2", "CS3", "CS4", "CS5", "CS6",
        "CC 2013", "CC 2014", "CC 2015", "CC 2017", "CC 2018", "CC 2019", "CC 2020", "CC 2021", "CC 2022", "CC 2023", "CC 2024"
      ]
    },
    {
      "parent": "PSD",
      "children": [
        "7", "CS", "CS2", "CS3", "CS4", "CS5", "CS6",
        "CC 2013", "CC 2014", "CC 2015", "CC 2017", "CC 2018", "CC 2019", "CC 2020", "CC 2021", "CC 2022", "CC 2023", "CC 2024"
      ]
    },
    {
      "parent": "PDF",
      "children": [
        "1.0", "1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "2.0",
        "PDF/X-1a", "PDF/X-3", "PDF/X-4"
      ]
    },
    {
      "parent": "EPS",
      "children": [
        "Illustrator 8", "CS", "CS2", "CS3", "CS4", "CS5", "CS6",
        "PostScript Level 1", "PostScript Level 2", "PostScript Level 3"
      ]
    },
    {
      "parent": "TIFF",
      "children": [
        "8-bit", "16-bit", "32-bit", "LZW Compression", "ZIP Compression", "Uncompressed"
      ]
    },
    {
      "parent": "JPG",
      "children": [
        "Baseline", "Progressive", "JPEG 2000"
      ]
    },
    {
      "parent": "PNG",
      "children": [
        "PNG-8", "PNG-24", "PNG-32"
      ]
    },
    {
      "parent": "SVG",
      "children": [
        "1.0", "1.1", "2.0"
      ]
    },
    {
      "parent": "INDD",
      "children": [
        "CS", "CS2", "CS3", "CS4", "CS5", "CS6",
        "CC 2013", "CC 2014", "CC 2015", "CC 2017", "CC 2018", "CC 2019", "CC 2020", "CC 2021", "CC 2022", "CC 2023", "CC 2024"
      ]
    },
    {
      "parent": "RAW",
      "children": [
        { "type": "Canon", "formats": ["CR2", "CR3"] },
        { "type": "Nikon", "formats": ["NEF"] },
        { "type": "Sony", "formats": ["ARW"] },
        { "type": "Adobe", "formats": ["DNG"] }
      ]
    },
    {
      "parent": "ZIP",
      "children": [
        "ZIP 2.0", "ZIP64"
      ]
    },
    {
      "parent": "RAR",
      "children": [
        "RAR4", "RAR5"
      ]
    },
    {
      "parent": "7Z",
      "children": [
        "LZMA", "LZMA2"
      ]
    }
  ]
};

const FileUpload = ({ onUploadSuccess, adminPassword }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState(''); // Now Required
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [fileType, setFileType] = useState(FILE_TYPES_DATA.fileTypes[0].parent);
  const [category, setCategory] = useState('Wedding Card');
  const [fontsIncluded, setFontsIncluded] = useState('Yes');

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!thumbnail || !sourceFile || !title || !price || !salePrice) {
      setMessage('Please fill all required fields (including Sale Price) and select both files.');
      return;
    }

    if (salePrice && parseFloat(salePrice) >= parseFloat(price) && parseFloat(price) !== 0) {
      setMessage('Sale Price must be less than Regular Price.');
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
    formData.append('category', category);
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
              <select
                value={fileType}
                onChange={e => {
                  setFileType(e.target.value);
                  setVersion(''); // Reset version on type change
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              >
                {FILE_TYPES_DATA.fileTypes.map(ft => (
                  <option key={ft.parent} value={ft.parent}>{ft.parent}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500">
                {['Wedding Card', 'Visiting Card', 'Invitation Card', 'Birthday Banner', 'Festival Post', 'Political Banner', 'Business Flyer', 'Social Media Post', 'Logo Design', 'Letterhead', 'Bill Book', 'Pamphlet', 'Brochure', 'Menu Card', 'Certificate', 'Resume/CV', 'Calendar', 'Calendar Design', 'Sticker/Label', 'Envelope', 'ID Card', 'Poster', 'Thumbnail', 'Web Banner', 'Infographic', 'Presentation', 'E-Book Cover', 'T-Shirt Design', 'Mug Design', 'Standee', 'Flex Banner', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="freeProduct"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                onChange={(e) => {
                  if (e.target.checked) {
                    setPrice('0');
                    setSalePrice('0');
                  } else {
                    setPrice('');
                    setSalePrice('');
                  }
                }}
              />
              <label htmlFor="freeProduct" className="ml-2 block text-sm text-gray-900 font-bold">
                Free Product (Zero Price)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Regular Price (Higher MRP) *</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                disabled={price === '0' && salePrice === '0'}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g. 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sale Price (Selling Amount) *</label>
              <input
                type="number"
                value={salePrice}
                onChange={e => setSalePrice(e.target.value)}
                required
                disabled={price === '0' && salePrice === '0'}
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${parseFloat(salePrice) >= parseFloat(price) && price !== '0' ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. 200"
              />
              {parseFloat(salePrice) >= parseFloat(price) && price !== '0' && (
                <p className="text-xs text-red-500 mt-1">Sale price must be less than Regular Price.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Version / Format</label>
              <select
                value={version}
                onChange={e => setVersion(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Version</option>
                {FILE_TYPES_DATA.fileTypes.find(ft => ft.parent === fileType)?.children.map((child, idx) => {
                  if (typeof child === 'string') {
                    return <option key={idx} value={child}>{child}</option>;
                  } else if (typeof child === 'object' && child.type && child.formats) {
                    return (
                      <optgroup key={idx} label={child.type}>
                        {child.formats.map(fmt => (
                          <option key={fmt} value={fmt}>{fmt}</option>
                        ))}
                      </optgroup>
                    );
                  }
                  return null;
                })}
              </select>
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
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows="3"
              maxLength={1000}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product details..."
            ></textarea>
            <p className="text-xs text-gray-500 text-right mt-1">{description.length}/1000 characters</p>
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
