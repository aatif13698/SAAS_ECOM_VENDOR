import useDarkmode from '@/hooks/useDarkMode';
import statementService from '@/services/statement/statement.service';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ListAboutUs() {
    const [isDark] = useDarkmode();

    const [aboutUs, setAboutUs] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isViewing, setIsViewing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAboutUs = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await statementService.getListAbout();
                console.log('about', response?.data);
                setAboutUs(response?.data || null);
            } catch (error) {
                console.error('Error fetching about us:', error);
                // setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchAboutUs();
    }, []);

    const handleView = () => {
        navigate(`/about/view/${aboutUs._id}`)// Adjust path as needed
    };

    const handleEdit = () => {
        // Placeholder for edit functionality, e.g., navigate to edit page
        console.log('Edit about us:', aboutUs);
        navigate(`/about/edit/${aboutUs._id}`)// Adjust path as needed
        // Example: window.location.href = `/edit/${aboutUs._id}`;
    };

    const handleCreate = () => {
        // Placeholder for create functionality, e.g., navigate to create page
        navigate("/create-about")
        console.log('Create new about us');
        // Example: window.location.href = '/create';
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">{error}</div>;
    }

    return (
        <div className={`mx-auto shadow-md rounded-lg p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <h1 className="text-2xl font-bold mb-4">About Us Management</h1>

            {!aboutUs ? (
                <div className='w-full'>
                    <button
                        onClick={handleCreate}
                        className="bg-lightBtn mb-4 dark:bg-darkBtn p-3 rounded-md text-white text-center btn inline-flex justify-center"
                    >
                        Create About Us
                    </button>
                    <div className="border flex justify-center w-[100%] border-gray-300 p-4 rounded-lg  bg-white shadow-md">
                        <p>No About Us Content Found.</p>
                    </div>


                </div>
            ) : (
                <div className="border border-gray-300 p-4 rounded-lg max-w-md bg-white shadow-md">
                    <h2 className="text-xl font-semibold mb-2">{aboutUs.title}</h2>
                    <div className="flex space-x-2 mb-4">
                        <button
                            onClick={handleView}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            View
                        </button>
                        <button
                            onClick={handleEdit}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                    </div>

                    {/* {isViewing && (
                        <div className="mt-4">
                            <div
                                // className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: aboutUs.description }}
                            />
                            {aboutUs.images && aboutUs.images.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium mb-2">Images:</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {aboutUs.images.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt={`About Us Image ${index + 1}`}
                                                className="w-full h-auto rounded"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => setIsViewing(false)}
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Close View
                            </button>
                        </div>
                    )} */}
                </div>
            )}
        </div>
    );
}

export default ListAboutUs;