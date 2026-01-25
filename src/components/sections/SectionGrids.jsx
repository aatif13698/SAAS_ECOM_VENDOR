import React from 'react'



const columnsData = [
    {
      heading: 'Mobile Phone',
      products: [
        { id: 1, name: 'Product 1', price: '$10', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 2, name: 'Product 2', price: '$15', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 3, name: 'Product 3', price: '$20', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 4, name: 'Product 4', price: '$25', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
      ],
    },
    {
      heading: 'Laptops',
      products: [
        { id: 5, name: 'Product 5', price: '$12', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 6, name: 'Product 6', price: '$18', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 7, name: 'Product 7', price: '$22', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 8, name: 'Product 8', price: '$28', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
      ],
    },
    {
      heading: 'Screens',
      products: [
        { id: 9, name: 'Product 9', price: '$11', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 10, name: 'Product 10', price: '$16', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 11, name: 'Product 11', price: '$21', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 12, name: 'Product 12', price: '$26', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
      ],
    },
    {
      heading: 'Watches',
      products: [
        { id: 13, name: 'Product 13', price: '$13', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 14, name: 'Product 14', price: '$17', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 15, name: 'Product 15', price: '$23', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
        { id: 16, name: 'Product 16', price: '$29', image: `https://sb.kaleidousercontent.com/67418/1920x1100/3a96a6f97b/transparent.png`  },
      ],
    },
  ];

function SectionGrids() {
  return (
    <div>

        <CartTypeOne/>
    </div>
  )
}

export default SectionGrids




// Sample data for each column


const CartTypeOne = () => {
  
  return (
    <div className=" mx-auto bg-red-50 py-4 px-2 mb-4 ">
      {/* Outer grid: 1 col on small, 2 on medium, 4 on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columnsData.map((column, idx) => (
          <div key={idx} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">{column.heading}</h2>
            {/* Inner grid: always 2 columns for product cards */}
            <div className="grid grid-cols-2 gap-4">
              {column.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-3 rounded border-[1px] flex flex-col items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-contain mb-2"
                  />
                  <p className="text-md font-medium">{product.name}</p>
                  <p className="text-sm font-bold text-green-600">{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



