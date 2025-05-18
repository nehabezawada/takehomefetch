import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dogService } from '../api/dogService';
import { Dog } from '../types';
import { useAuth } from '../context/AuthContext';

const DogSearch: React.FC = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [breeds, setBreeds] = useState<string[]>([]);
    const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
    const [breedQuery, setBreedQuery] = useState('');
    const [showBreedDropdown, setShowBreedDropdown] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDogs, setTotalDogs] = useState(0);
    const [loading, setLoading] = useState(false);
    const [match, setMatch] = useState<Dog | null>(null);
    const { logout } = useAuth();
    const breedDropdownRef = useRef<HTMLDivElement>(null);

    const ITEMS_PER_PAGE = 25;

    useEffect(() => {
        fetchBreeds();
        fetchDogs();
    }, [currentPage, selectedBreeds, sortOrder]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (breedDropdownRef.current && !breedDropdownRef.current.contains(event.target as Node)) {
                setShowBreedDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchBreeds = async () => {
        try {
            const breedsList = await dogService.getBreeds();
            setBreeds(breedsList);
        } catch (error) {
            console.error('Error fetching breeds:', error);
        }
    };

    const fetchDogs = async () => {
        setLoading(true);
        try {
            const searchParams = {
                breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
                size: ITEMS_PER_PAGE,
                from: ((currentPage - 1) * ITEMS_PER_PAGE).toString(),
                sort: `breed:${sortOrder}`,
            };

            const searchResponse = await dogService.searchDogs(searchParams);
            const dogDetails = await dogService.getDogs(searchResponse.resultIds);
            setDogs(dogDetails);
            setTotalDogs(searchResponse.total);
        } catch (error) {
            console.error('Error fetching dogs:', error);
        }
        setLoading(false);
    };

    const filteredBreeds = breedQuery === ''
        ? breeds
        : breeds.filter((breed) => breed.toLowerCase().includes(breedQuery.toLowerCase()));

    const handleBreedChange = (breed: string) => {
        setSelectedBreeds((prev) =>
            prev.includes(breed)
                ? prev.filter((b) => b !== breed)
                : [...prev, breed]
        );
        setCurrentPage(1);
    };

    const removeBreed = (breed: string) => {
        setSelectedBreeds((prev) => prev.filter((b) => b !== breed));
    };

    const toggleFavorite = (dogId: string) => {
        setFavorites((prev) =>
            prev.includes(dogId)
                ? prev.filter((id) => id !== dogId)
                : [...prev, dogId]
        );
    };

    const handleMatch = async () => {
        if (favorites.length === 0) return;
        try {
            const matchResponse = await dogService.getMatch(favorites);
            const matchedDog = await dogService.getDogs([matchResponse.match]);
            setMatch(matchedDog[0]);
        } catch (error) {
            console.error('Error getting match:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 py-10 px-2 md:px-0">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-5xl font-extrabold text-primary drop-shadow-lg tracking-tight text-center md:text-left">Find Your Perfect Dog</h1>
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-8 py-3 rounded-2xl shadow-lg font-bold text-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        Logout
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-8 sticky top-8 h-fit border border-blue-100"
                    >
                        <h2 className="text-2xl font-bold mb-2 text-primary">Filters</h2>
                        <div>
                            <h3 className="font-semibold mb-2">Breed</h3>
                            {/* Selected breeds as tags */}
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedBreeds.map((breed) => (
                                    <motion.span
                                        key={breed}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="bg-gradient-to-r from-blue-200 to-purple-200 text-blue-900 px-3 py-1 rounded-full flex items-center text-sm font-semibold shadow"
                                    >
                                        {breed}
                                        <button
                                            className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                                            onClick={() => removeBreed(breed)}
                                            aria-label={`Remove ${breed}`}
                                        >
                                            ×
                                        </button>
                                    </motion.span>
                                ))}
                            </div>
                            {/* Dropdown */}
                            <div className="relative" ref={breedDropdownRef}>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-medium shadow"
                                    onClick={() => setShowBreedDropdown((show) => !show)}
                                >
                                    {selectedBreeds.length > 0 ? 'Edit Breeds' : 'Select Breeds'}
                                    <span className="float-right">▼</span>
                                </motion.button>
                                <AnimatePresence>
                                    {showBreedDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl"
                                        >
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none rounded-t-xl"
                                                placeholder="Search breeds..."
                                                value={breedQuery}
                                                onChange={(e) => setBreedQuery(e.target.value)}
                                            />
                                            <div className="max-h-48 overflow-y-auto">
                                                {filteredBreeds.length === 0 && (
                                                    <div className="p-3 text-gray-500">No breeds found.</div>
                                                )}
                                                {filteredBreeds.map((breed) => (
                                                    <label key={breed} className="flex items-center px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedBreeds.includes(breed)}
                                                            onChange={() => handleBreedChange(breed)}
                                                            className="mr-2 rounded text-blue-600 focus:ring-2 focus:ring-blue-400"
                                                        />
                                                        <span>{breed}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 mt-4">Sort Order</h3>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                                className="w-full rounded-lg border-gray-300 py-2 px-3 bg-gray-100 focus:border-primary focus:ring-primary font-medium shadow"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* Dog List */}
                    <div className="md:col-span-3">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <svg className="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                            </div>
                        ) : (
                            <motion.div
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
                            >
                                <AnimatePresence>
                                    {dogs.map((dog) => (
                                        <motion.div
                                            key={dog.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col hover:shadow-3xl transition-shadow duration-300 border border-blue-100"
                                        >
                                            <img
                                                src={dog.img}
                                                alt={dog.name}
                                                className="w-full h-56 object-cover object-center"
                                            />
                                            <div className="p-6 flex flex-col flex-1">
                                                <h3 className="text-2xl font-bold text-gray-800 mb-1">{dog.name}</h3>
                                                <p className="text-gray-600 mb-1">Breed: <span className="font-medium">{dog.breed}</span></p>
                                                <p className="text-gray-600 mb-1">Age: <span className="font-medium">{dog.age} years</span></p>
                                                <p className="text-gray-600 mb-1">Location: <span className="font-medium">{dog.zip_code}</span></p>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => toggleFavorite(dog.id)}
                                                    className={`mt-auto w-full py-2 rounded-lg font-semibold shadow transition-colors duration-200 ${
                                                        favorites.includes(dog.id)
                                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                                    }`}
                                                >
                                                    {favorites.includes(dog.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* Pagination */}
                        <div className="mt-10 flex justify-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-6 py-2 bg-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50 shadow"
                            >
                                Previous
                            </motion.button>
                            <span className="py-2 font-bold text-lg">
                                Page {currentPage} of {Math.ceil(totalDogs / ITEMS_PER_PAGE)}
                            </span>
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                disabled={currentPage >= Math.ceil(totalDogs / ITEMS_PER_PAGE)}
                                className="px-6 py-2 bg-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50 shadow"
                            >
                                Next
                            </motion.button>
                        </div>

                        {/* Match Button */}
                        {favorites.length > 0 && (
                            <div className="mt-10 text-center">
                                <motion.button
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={handleMatch}
                                    className="bg-green-500 text-white px-10 py-4 rounded-2xl text-2xl font-extrabold shadow-xl hover:bg-green-600 transition-colors"
                                >
                                    Find My Match!
                                </motion.button>
                            </div>
                        )}

                        {/* Match Result */}
                        {match && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-12 bg-white p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-10 border border-green-200"
                            >
                                <img
                                    src={match.img}
                                    alt={match.name}
                                    className="w-48 h-48 object-cover rounded-2xl border-4 border-primary shadow-lg"
                                />
                                <div>
                                    <h2 className="text-4xl font-extrabold mb-2 text-green-600">Your Perfect Match!</h2>
                                    <h3 className="text-3xl font-bold mb-2">{match.name}</h3>
                                    <p className="text-gray-600 text-lg">Breed: <span className="font-medium">{match.breed}</span></p>
                                    <p className="text-gray-600 text-lg">Age: <span className="font-medium">{match.age} years</span></p>
                                    <p className="text-gray-600 text-lg">Location: <span className="font-medium">{match.zip_code}</span></p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DogSearch; 