
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaHome,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSignOutAlt,
  FaSearch,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from 'react-icons/fa';

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector(
    (state) => state.user
  );

  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState('');
  const [listingsLoading, setListingsLoading] = useState(false);
  const [showListings, setShowListings] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [listingFilter, setListingFilter] = useState('all');

  const [deleteListingId, setDeleteListingId] = useState(null);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [notification, setNotification] = useState(null);

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Upload profile image
  useEffect(() => {
    if (!file) return;

    if (file.size >= 2 * 1024 * 1024) {
      setFileUploadError('Image must be smaller than 2 MB.');
      setFilePerc(0);
      setUploading(false);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFileUploadError('Please select an image file.');
      return;
    }

    setFileUploadError('');
    setUploading(true);
    setFilePerc(0);

    const storage = getStorage(app);
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const unsubscribe = uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(error.message || 'Upload failed.');
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(
            uploadTask.snapshot.ref
          );

          setFormData((prev) => ({
            ...prev,
            avatar: downloadURL,
          }));

          setUploading(false);
          notify('Profile image uploaded successfully!');
        } catch (error) {
          setFileUploadError(error.message);
          setUploading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [file]);

  const handleChange = (e) => {
    setUpdateSuccess(false);

    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // Update user
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?._id) return;

    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);

      const res = await fetch(
        `/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(
          updateUserFailure(data.message || 'Update failed.')
        );
        return;
      }

      dispatch(updateUserSuccess(data));
      setFormData({});
      setUpdateSuccess(true);
      notify('Your profile has been updated!');
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // Delete account
  const handleDeleteUser = async () => {
    if (!currentUser?._id) return;

    try {
      dispatch(deleteUserStart());

      const res = await fetch(
        `/api/user/delete/${currentUser._id}`,
        { method: 'DELETE' }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(
          deleteUserFailure(data.message || 'Delete failed.')
        );
        setShowDeleteAccount(false);
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());

      const res = await fetch('/api/auth/signout');
      const data = await res.json();

      if (!res.ok || data.success === false) {
        dispatch(
          signOutUserFailure(data.message || 'Sign out failed.')
        );
        return;
      }

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  // Show user listings
  const handleShowListings = async () => {
    if (showListings) {
      setShowListings(false);
      return;
    }

    if (!currentUser?._id) {
      setShowListingsError('Please sign in again.');
      return;
    }

    try {
      setListingsLoading(true);
      setShowListingsError('');

      const res = await fetch(
        `/api/user/listings/${currentUser._id}`
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setShowListingsError(
          data.message || 'Unable to load listings.'
        );
        return;
      }

      setUserListings(data);
      setShowListings(true);
    } catch (error) {
      setShowListingsError(error.message);
    } finally {
      setListingsLoading(false);
    }
  };

  // Delete property listing
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(
        `/api/listing/delete/${listingId}`,
        { method: 'DELETE' }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        notify(data.message || 'Delete failed.', 'error');
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );

      setDeleteListingId(null);
      notify('Listing deleted successfully!');
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  // Search and filter listings
  const filteredListings = userListings.filter((listing) => {
    const matchesSearch =
      listing.name?.toLowerCase().includes(
        searchTerm.toLowerCase()
      ) ||
      listing.address?.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

    const matchesFilter =
      listingFilter === 'all' ||
      (listingFilter === 'rent' && listing.type === 'rent') ||
      (listingFilter === 'sale' && listing.type === 'sale');

    return matchesSearch && matchesFilter;
  });

  const totalRent = userListings.filter(
    (listing) => listing.type === 'rent'
  ).length;

  const totalSale = userListings.filter(
    (listing) => listing.type === 'sale'
  ).length;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Please sign in</h2>
        <Link
          to="/sign-in"
          className="bg-slate-800 text-white px-6 py-3 rounded-lg"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-16">

      {/* Header */}
      <div className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-400 font-semibold mb-2">
            TAZAN ESTATE
          </p>

          <h1 className="text-3xl md:text-4xl font-bold">
            My Dashboard
          </h1>

          <p className="text-slate-300 mt-2">
            Manage your account and property listings.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6">

        {/* Notification */}
        {notification && (
          <div
            role="status"
            className={`mb-5 flex items-center justify-between gap-3 p-4 rounded-xl shadow ${
              notification.type === 'error'
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'error' ? (
                <FaExclamationCircle />
              ) : (
                <FaCheckCircle />
              )}
              <span>{notification.message}</span>
            </div>

            <button
              onClick={() => setNotification(null)}
              aria-label="Dismiss notification"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
            <div className="flex flex-col items-center">

              <div
                className="relative cursor-pointer group"
                onClick={() => fileRef.current?.click()}
              >
                <img
                  src={formData.avatar || currentUser.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-amber-400"
                />

                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <FaCamera className="text-white text-2xl" />
                </div>
              </div>

              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                  e.target.value = '';
                }}
              />

              <h2 className="text-xl font-bold mt-4">
                {currentUser.username}
              </h2>

              <p className="text-slate-500 text-sm break-all">
                {currentUser.email}
              </p>

              <span className="mt-3 bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full">
                Property Owner
              </span>

              {uploading && (
                <div className="w-full mt-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Uploading image</span>
                    <span>{filePerc}%</span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${filePerc}%` }}
                    />
                  </div>
                </div>
              )}

              {fileUploadError && (
                <p className="text-red-600 text-sm mt-3">
                  {fileUploadError}
                </p>
              )}

              <p className="text-xs text-slate-400 mt-3">
                Click your photo to change it. Max 2 MB.
              </p>
            </div>

            <div className="border-t mt-6 pt-6 space-y-3">
              <Link
                to="/create-listing"
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-semibold transition"
              >
                <FaPlus />
                Create New Listing
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 border border-slate-300 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                <FaSignOutAlt />
                Sign Out
              </button>

              <button
                onClick={() => setShowDeleteAccount(true)}
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-3 rounded-xl transition"
              >
                <FaTrash />
                Delete Account
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-2 space-y-6">

            {/* Edit Profile */}
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaUser className="text-amber-500 text-xl" />

                <div>
                  <h2 className="text-2xl font-bold">
                    Account Settings
                  </h2>

                  <p className="text-sm text-slate-500">
                    Update your personal information
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold mb-2"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <FaUser className="absolute left-4 top-4 text-slate-400" />

                    <input
                      type="text"
                      id="username"
                      value={
                        formData.username ??
                        currentUser.username ??
                        ''
                      }
                      onChange={handleChange}
                      className="w-full border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-2"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-4 text-slate-400" />

                    <input
                      type="email"
                      id="email"
                      value={
                        formData.email ??
                        currentUser.email ??
                        ''
                      }
                      onChange={handleChange}
                      className="w-full border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-2"
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <FaLock className="absolute left-4 top-4 text-slate-400" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={formData.password || ''}
                      placeholder="Leave blank to keep current password"
                      onChange={handleChange}
                      className="w-full border rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-slate-500"
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading || uploading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>

                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}

                {updateSuccess && (
                  <p className="text-green-600 text-sm flex items-center gap-2">
                    <FaCheckCircle />
                    Profile updated successfully!
                  </p>
                )}
              </form>
            </div>

            {/* Property Statistics */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  title: 'Total Listings',
                  value: userListings.length,
                  icon: <FaHome />,
                },
                {
                  title: 'For Rent',
                  value: totalRent,
                  icon: <FaBed />,
                },
                {
                  title: 'For Sale',
                  value: totalSale,
                  icon: <FaHome />,
                },
              ].map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white p-4 rounded-xl shadow-sm text-center"
                >
                  <div className="text-amber-500 flex justify-center mb-2">
                    {stat.icon}
                  </div>

                  <p className="text-2xl font-bold">
                    {showListings ? stat.value : '—'}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {stat.title}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-2xl shadow-md mt-8 p-6 md:p-8">

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                My Properties
              </h2>

              <p className="text-slate-500 text-sm mt-1">
                View and manage your real estate listings
              </p>
            </div>

            <button
              onClick={handleShowListings}
              disabled={listingsLoading}
              className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition disabled:opacity-60"
            >
              {listingsLoading
                ? 'Loading...'
                : showListings
                ? 'Hide Properties'
                : 'View My Properties'}
            </button>
          </div>

          {showListingsError && (
            <p className="text-red-600 mb-4">
              {showListingsError}
            </p>
          )}

          {showListings && (
            <>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-3 mb-6">

                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-4 text-slate-400" />

                  <input
                    type="text"
                    placeholder="Search by property name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <select
                  value={listingFilter}
                  onChange={(e) => setListingFilter(e.target.value)}
                  className="border rounded-xl px-4 py-3 bg-white"
                >
                  <option value="all">All Properties</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>

              {/* Property Cards */}
              {filteredListings.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {filteredListings.map((listing) => (
                    <div
                      key={listing._id}
                      className="border rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 group"
                    >
                      <div className="relative overflow-hidden">
                        <Link to={`/listing/${listing._id}`}>
                          <img
                            src={listing.imageUrls?.[0]}
                            alt={listing.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
                          />
                        </Link>

                        <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-2 rounded-lg">
                          {listing.type === 'rent'
                            ? 'FOR RENT'
                            : 'FOR SALE'}
                        </span>
                      </div>

                      <div className="p-4">
                        <Link to={`/listing/${listing._id}`}>
                          <h3 className="font-bold text-lg truncate hover:text-amber-600">
                            {listing.name}
                          </h3>
                        </Link>

                        <p className="flex items-center gap-2 text-slate-500 text-sm mt-2 truncate">
                          <FaMapMarkerAlt className="text-amber-500" />
                          {listing.address}
                        </p>

                        <div className="flex gap-4 text-slate-600 text-sm mt-4">
                          <span className="flex items-center gap-2">
                            <FaBed />
                            {listing.bedrooms} Beds
                          </span>

                          <span className="flex items-center gap-2">
                            <FaBath />
                            {listing.bathrooms} Baths
                          </span>
                        </div>

                        <p className="text-xl font-bold text-slate-900 mt-4">
                          ${Number(
                            listing.offer
                              ? listing.discountPrice
                              : listing.regularPrice
                          ).toLocaleString('en-CA')}
                          {listing.type === 'rent' && (
                            <span className="text-sm text-slate-500 font-normal">
                              /month
                            </span>
                          )}
                        </p>

                        <div className="flex gap-2 mt-5">
                          <Link
                            to={`/update-listing/${listing._id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition"
                          >
                            <FaEdit />
                            Edit
                          </Link>

                          <button
                            onClick={() => setDeleteListingId(listing._id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition"
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaHome className="text-5xl text-slate-300 mx-auto mb-4" />

                  <h3 className="text-lg font-semibold">
                    No properties found
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Try another search or create a new listing.
                  </p>

                  <Link
                    to="/create-listing"
                    className="inline-block mt-5 bg-amber-500 text-white px-6 py-3 rounded-xl"
                  >
                    Add Property
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Listing Confirmation */}
      {deleteListingId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-listing-title"
            className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl"
          >
            <FaTrash className="text-red-500 text-4xl mx-auto mb-4" />

            <h2
              id="delete-listing-title"
              className="text-xl font-bold text-center"
            >
              Delete Property?
            </h2>

            <p className="text-slate-500 text-center mt-3">
              This listing will be permanently removed.
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteListingId(null)}
                className="flex-1 border rounded-xl py-3"
              >
                Cancel
              </button>

              <button
                onClick={() => handleListingDelete(deleteListingId)}
                className="flex-1 bg-red-600 text-white rounded-xl py-3"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="bg-white rounded-2xl p-7 max-w-md w-full shadow-2xl"
          >
            <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />

            <h2
              id="delete-account-title"
              className="text-xl font-bold text-center"
            >
              Delete Your Account?
            </h2>

            <p className="text-slate-500 text-center mt-3">
              Are you sure? Your account will be permanently
              deleted. This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteAccount(false)}
                className="flex-1 border rounded-xl py-3"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteUser}
                className="flex-1 bg-red-600 text-white rounded-xl py-3"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
