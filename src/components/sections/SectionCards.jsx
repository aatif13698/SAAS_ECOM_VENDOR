
import React, { useEffect, useState } from 'react';

const columnsData = {
    products: [
        { id: 1, name: 'Product 1', price: '$10', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png` },
        { id: 2, name: 'Product 2', price: '$15', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png` },
        { id: 3, name: 'Product 3', price: '$20', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png` },
        { id: 4, name: 'Product 4', price: '$25', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png` },
        { id: 5, name: 'Product 5', price: '$25', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png` },
        { id: 6, name: 'Product 6', price: '$25', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png` },
    ],
};

const CardType1 = () => {
    return (
        <div className="bg-red-50 py-4 px-2 mb-4">
            <p className="text-left text-lg font-bold mb-4">Card Type 1</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {columnsData?.products.map((column, idx) => (
                    <div key={idx} className="bg-white p-4 rounded shadow-md">
                        <div className="bg-white p-3 rounded border-[1px] flex flex-col items-center">
                            <img
                                src={column.image}
                                alt={column.name}
                                className="w-24 h-24 object-contain mb-2"
                            />
                            <p className="text-md font-medium">{column.name}</p>
                            <p className="text-sm font-bold text-green-600">{column.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType2 = () => {
    return (
        <div className="bg-blue-100 py-6 px-4 mb-4 rounded-lg">
            <p className="text-center text-xl font-semibold mb-6 text-blue-800">Card Type 2</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {columnsData?.products.map((column, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col items-center">
                            <img
                                src={column.image}
                                alt={column.name}
                                className="w-28 h-28 object-contain mb-3"
                            />
                            <p className="text-lg font-bold">{column.name}</p>
                            <p className="text-base font-medium text-blue-600">{column.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType3 = () => {
    return (
        <div className="bg-gray-50 py-5 px-3 mb-4 border border-gray-200">
            <p className="text-left text-2xl font-extrabold mb-5 text-gray-900">Card Type 3 </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {columnsData?.products.map((column, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-md shadow-sm hover:scale-105 transition-transform duration-200">
                        <div className="flex flex-col items-start">
                            <img
                                src={column.image}
                                alt={column.name}
                                className="w-20 h-20 object-contain mb-4"
                            />
                            <p className="text-base font-semibold text-gray-800">{column.name}</p>
                            <p className="text-sm font-bold text-red-500">{column.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType4 = () => {
    return (
        <div className="bg-green-50 py-4 px-4 mb-4 rounded-xl">
            <p className="text-right text-lg font-medium mb-4 text-green-700">Card Type 4</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData?.products.map((column, idx) => (
                    <div key={idx} className="bg-green-100 p-4 rounded-xl shadow-md border border-green-300 hover:border-green-500 transition-colors duration-300">
                        <div className="flex flex-col items-center">
                            <img
                                src={column.image}
                                alt={column.name}
                                className="w-32 h-32 object-contain mb-2 rounded-full"
                            />
                            <p className="text-md font-bold text-gray-900">{column.name}</p>
                            <p className="text-xs font-semibold text-green-800">{column.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType5 = () => {
    return (
        <div className="bg-purple-50 py-5 px-5 mb-4">
            <p className="text-center text-3xl font-bold mb-6 text-purple-900">Card Type 5</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {columnsData?.products.map((column, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-sm shadow-xl hover:rotate-1 transition-transform duration-300">
                        <div className="flex flex-col items-center">
                            <img
                                src={column.image}
                                alt={column.name}
                                className="w-16 h-16 object-contain mb-3"
                            />
                            <p className="text-sm font-light text-purple-700">{column.name}</p>
                            <p className="text-lg font-extrabold text-black">{column.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType6 = () => {
    return (
        <div className="bg-yellow-50 py-3 px-2 mb-4 border-t-4 border-yellow-500">
            <p className="text-left text-xl font-serif mb-4 text-yellow-800">Card Type 6</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-7">
                {columnsData?.products.map((column, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-none border-2 border-dashed border-gray-300 hover:border-solid hover:border-yellow-600 transition-all duration-300">
                        <div className="flex flex-col items-end">
                            <img
                                src={column.image}
                                alt={column.name}
                                className="w-24 h-24 object-contain mb-1"
                            />
                            <p className="text-xl font-medium">{column.name}</p>
                            <p className="text-md font-bold text-orange-600">{column.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType7 = () => {
    return (
        <div className="bg-pink-100 py-4 px-6 mb-4 rounded-md">
            <p className="text-center text-base font-mono mb-5 text-pink-900">Card Type 7</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {columnsData?.products.map((column, idx) => (
                    <div key={idx} className="bg-pink-50 p-4 rounded-md shadow-inner hover:shadow-outer transition-shadow duration-200">
                        <div className="flex flex-col items-center">
                            <img
                                src={column.image}
                                alt={column.name}
                                className="w-30 h-30 object-contain mb-4 rounded-md"
                            />
                            <p className="text-lg font-semibold text-gray-700">{column.name}</p>
                            <p className="text-sm font-light text-pink-600">{column.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType8 = () => {
    return (
        <div className="bg-indigo-50 py-6 px-3 mb-4">
            <p className="text-right text-2xl font-bold italic mb-4 text-indigo-800">Card Type 8 </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {columnsData?.products.map((column, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-lg shadow-md hover:bg-indigo-100 transition-colors duration-300">
                        <div className="flex flex-col items-center">
                            <img
                                src={column.image}
                                alt={column.name}
                                className="w-22 h-22 object-contain mb-2"
                            />
                            <p className="text-base font-bold">{column.name}</p>
                            <p className="text-xs font-medium text-indigo-600">{column.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType9 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 9</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData?.products.map((column, idx) => (
                    <div key={idx} className="bg-teal-100 p-3 rounded-md shadow-lg hover:translate-y-1 transition-transform duration-300">
                        <div className="flex flex-col items-start">
                            <img
                                src={column.image}
                                alt={column.name}
                                className="w-26 h-26 object-contain mb-3"
                            />
                            <p className="text-md font-medium text-gray-800">{column.name}</p>
                            <p className="text-base font-bold text-teal-700">{column.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType10 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 10</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData.products.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-xl p-4 bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg"
                    >
                        <img src={item.image} className="w-20 mx-auto mb-4" alt={item.name} />
                        <p className="text-lg font-semibold text-center">{item.name}</p>
                        <p className="text-center opacity-90">{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType11 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 11</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData.products.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white/60 backdrop-blur-md p-4 rounded-xl border shadow-sm"
                    >
                        <img src={item.image} className="w-20 mx-auto mb-2" alt={item.name} />
                        <p className="text-center font-semibold">{item.name}</p>
                        <p className="text-center text-sm text-slate-600">{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType12 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 12 </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData.products.map((item) => (
                    <div
                        key={item.id}
                        className="p-4 rounded-lg border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white transition"
                    >
                        <img src={item.image} className="w-20 mx-auto mb-3" alt={item.name} />
                        <p className="font-semibold text-center">{item.name}</p>
                        <p className="text-center">{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType13 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 13</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData.products.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-100 p-4 rounded-xl shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]"
                    >
                        <img src={item.image} className="w-20 mx-auto mb-3" alt={item.name} />
                        <p className="text-center font-medium">{item.name}</p>
                        <p className="text-center text-gray-600">{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType14 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 14</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData.products.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-md">
                        <div className="bg-violet-100 p-6 flex justify-center">
                            <img src={item.image} className="w-24" alt={item.name} />
                        </div>
                        <div className="p-4 text-center">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-violet-600 font-bold">{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType15 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 15</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData.products.map((item) => (
                    <div
                        key={item.id}
                        className="bg-zinc-900 text-white p-4 rounded-xl shadow-lg hover:scale-105 transition"
                    >
                        <img src={item.image} className="w-20 mx-auto mb-3" alt={item.name} />
                        <p className="text-center font-semibold">{item.name}</p>
                        <p className="text-center text-zinc-400">{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType16 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 16 </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData.products.map((item) => (
                    <div
                        key={item.id}
                        className="relative bg-white p-4 rounded-xl shadow-md"
                    >
                        <span className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-semibold">
                            NEW
                        </span>
                        <img src={item.image} className="w-20 mx-auto mb-3" alt={item.name} />
                        <p className="text-center font-medium">{item.name}</p>
                        <p className="text-center text-yellow-600 font-bold">{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType17 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 17</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData.products.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
                    >
                        <img src={item.image} className="w-14" alt={item.name} />
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sky-600 font-bold text-sm">{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CardType18 = () => {
    return (
        <div className="bg-teal-50 py-5 px-4 mb-4 border-b-2 border-teal-400">
            <p className="text-left text-lg font-semibold underline mb-6 text-teal-900">Card Type 18</p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {columnsData.products.map((item) => (
                    <div
                        key={item.id}
                        className="rounded-xl p-4 bg-gradient-to-br from-blue-200 to-indigo-300 text-black shadow-lg"
                    >
                        <img src={item.image} className="w-20 mx-auto mb-4" alt={item.name} />
                        <p className="text-lg font-semibold text-center">{item.name}</p>
                        <p className="text-center opacity-90">{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const cardTypes = [
    { name: "CardType1", value: CardType1 },
    { name: "CardType2", value: CardType2 },
    { name: "CardType3", value: CardType3 },
    { name: "CardType4", value: CardType4 },
    { name: "CardType5", value: CardType5 },
    { name: "CardType6", value: CardType6 },
    { name: "CardType7", value: CardType7 },
    { name: "CardType8", value: CardType8 },
    { name: "CardType9", value: CardType9 },
    { name: "CardType10", value: CardType10 },
    { name: "CardType11", value: CardType11 },
    { name: "CardType12", value: CardType12 },
    { name: "CardType13", value: CardType13 },
    { name: "CardType14", value: CardType14 },
    { name: "CardType15", value: CardType15 },
    { name: "CardType16", value: CardType16 },
    { name: "CardType17", value: CardType17 },
    { name: "CardType18", value: CardType18 },
];

function SectionCards({ onSelect, template }) {
    const [selectedType, setSelectedType] = useState(null);


    console.log("template", template);
    console.log("selectedType", selectedType);


    const handleSelect = (type) => {
        
        setSelectedType(type);
        if (onSelect) {
            onSelect(type); // Callback to parent (e.g., for modal to close and store in page variable)
        }
    };

    useEffect(() => {

        if (template) {
            setSelectedType(template)
        }

    }, [template])



    return (
        <div className="flex w-full flex-col gap-4">
            {cardTypes.map((CardComponent, index) => {
                const type = index + 1;
                return (
                    <div key={type} className="border bg-white p-4 rounded-md">
                        <div className="flex items-center mb-4">
                            <input
                                id={`${CardComponent.name}`}
                                type="radio"
                                name="cardType"
                                checked={selectedType === CardComponent.name}
                                onChange={() => handleSelect(CardComponent.name)}
                                className="mr-3 h-5 w-5"
                            />
                            <label htmlFor={`${CardComponent.name}`} className="text-lg font-medium">
                                Select {CardComponent.name}
                            </label>
                        </div>
                        <CardComponent.value />
                    </div>
                );
            })}
        </div>
    );
}

export default SectionCards;