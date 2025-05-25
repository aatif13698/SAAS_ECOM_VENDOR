import ordersService from '@/services/orders/orders.service';
import React, { useEffect } from 'react'

function CreateOrder() {

  useEffect(() => {

    getStockList();

  },[]);

  async function getStockList(){
    try {

      // const response = await ordersService
      
    } catch (error) {
      console.log("error while getting the stock list", error);
    }
  }
  return (
    <div>

        This is create order page
      
    </div>
  )
}

export default CreateOrder
