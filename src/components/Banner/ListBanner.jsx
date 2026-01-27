import useDarkmode from '@/hooks/useDarkMode';
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import statementService from '@/services/statement/statement.service';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function ListBanner({ centered, noFade, scrollContent }) {
    const navigate = useNavigate();
    const [isDark] = useDarkmode();
    const [pending, setPending] = useState(true);
    const [paginationData, setPaginationData] = useState([]);

    console.log("paginationData", paginationData);


    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setPending(true);
            const response = await statementService.listBanner();
            const sections = response?.data?.banners || [];
            // Sort sections by order
            const sortedSections = sections.sort((a, b) => a.order - b.order);
            setPaginationData(sortedSections);
        } catch (error) {
            console.error("Error while fetching", error);
        } finally {
            setPending(false);
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const items = Array.from(paginationData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        // Update orders based on new positions
        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index + 1,
        }));
        setPaginationData(updatedItems);
    };

    const saveOrder = async () => {
        try {
            // Assuming statementService has an updateSectionOrders method that accepts array of {_id, order}
            // Adjust this based on your actual service implementation
            const clientId = localStorage.getItem("saas_client_clientId");

            const orderData = paginationData.map(({ _id, order }) => ({ _id, order }));
            const stringifiedOrderData = JSON.stringify(orderData)
            await statementService.arrangeOrderOfBanner({ updates: stringifiedOrderData, clientId: clientId });
            // Optionally, refetch or show success message
            alert('Order updated successfully'); // Replace with proper notification
        } catch (error) {
            console.error("Error while saving order", error);
            alert('Failed to update order'); // Replace with proper notification
        }
    };

    const renderCard = (section, index) => {
        return (
            <Draggable key={section._id} draggableId={section._id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`mb-4 p-4 border rounded-lg shadow-sm ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">Order: {section.order}</span>
                        </div>
                        <div className="mb-2 flex gap-2 ">
                            <p className="text-sm font-medium">Banner:</p>

                            <div className='p-2 border rounded-lg'>
                                <img className='w-[30vw] h-[20vh] object-cover' src={section?.image} alt="" />

                            </div>


                        </div>
                        <div className="mb-2 ">
                            <div className='flex gap-2'>
                                <p className="text-sm font-medium">Product:</p>
                                <p className="text-sm">
                                    {section?.product?.name}
                                </p>
                            </div>
                            <div className='p-2 w-fit border rounded-lg'>
                                <img className='w-[30vw] h-[20vh] object-cover' src={section?.product?.images[0]} alt="" />

                            </div>

                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate(`/banners/edit/${section._id}`)} // Adjust path as needed
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => navigate(`/banners/view/${section._id}`)} // Adjust path as needed
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                View
                            </button>
                        </div>
                    </div>
                )}
            </Draggable>
        );
    };

    return (
        <div className={`shadow-md ${isDark ? "bg-darkSecondary text-white" : "bg-white"} p-4`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Sections List</h2>
                <button
                    onClick={saveOrder}
                    className={` bg-lightBtn dark:bg-darkBtn px-4 py-2 rounded`}
                >
                    Adjust Order
                </button>
            </div>
            {pending ? (
                <div className="text-center">Loading...</div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sections-list">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {paginationData.map((section, index) => renderCard(section, index))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </div>
    );
}

export default ListBanner;