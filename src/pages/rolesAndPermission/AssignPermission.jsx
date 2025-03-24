import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import roleService from '@/services/roles/role.service';
import { FaPlus } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import FormLoader from '@/Common/formLoader/FormLoader';

function AssignPermission() {

    const [pageLoading, setPageLoading] = useState(false)
    const [rolesListData, setRolesListData] = useState([]);
    const [rolesListData2, setRolesListData2] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mainArr, setMainArr] = useState([])
    const navigate = useNavigate()
    const location = useLocation();
    const id = location?.state?.id;
    const name = location?.state?.name
    const clientId = localStorage.getItem("saas_client_clientId");

    const { capability: capabilityarray, isCapability } = useSelector((state) => state.capabilitySlice)


    // console.log("rolesListData2", rolesListData2);
    // console.log("rolesListData",rolesListData);
    
    // console.log("capabilityarray",capabilityarray);
    




    // const { capability: capabilityarray, isCapability } = useSelector((state) => state.capabilitySlice)

    // console.log("rolesListData", rolesListData);
    // console.log("capabilityarray", capabilityarray);

    useEffect(() => {

        if (rolesListData2 && capabilityarray) {
            const mainArray = capabilityarray;
            let newArr1 = [];
            for (let i = 0; i < mainArray.length; i++) {
                const element = mainArray[i];
                const moduleName = element?.name;
                const menu = element?.menu;
                let array2 = []
                for (let i = 0; i < menu.length; i++) {
                    let dataObject = {
                        module: "",
                        feature: "",
                        menuList: {},

                    }
                    const menuElement = menu[i];
                    dataObject.module = moduleName;
                    dataObject.feature = menuElement?.displayName;
                    dataObject.menuList = menuElement?.subMenus;
                    array2.push(dataObject)
                }
                newArr1 = [...newArr1, ...array2]
            }



            const result = updateDisabledKeys(newArr1, rolesListData2);

            setRolesListData(result)


        }

    }, [capabilityarray, rolesListData2]);



    function updateDisabledKeys(arr1, arr2) {
        return arr2.map(item2 => {
            const matchingItem = arr1.find(item1 => item1.feature === item2.feature);

            if (matchingItem) {
                // Update menuList in arr2 based on arr1
                const updatedMenuList = Object.keys(item2.menuList).reduce((acc, key) => {
                    acc[key] = {
                        ...item2.menuList[key],
                        disabled: !matchingItem.menuList[key]?.access // disabled is true if access is false
                    };
                    return acc;
                }, {});

                return {
                    ...item2,
                    menuList: updatedMenuList
                };
            }
            return item2; // If no matching feature is found, return the item as is
        });
    }


    useEffect(() => {
        setPageLoading(true)
        const data = {
            clientId: clientId,
            roleId: id
        }

        if (id) {
            getParticularRoles(data)
        }
    }, [])

    async function getParticularRoles(data) {
        try {
            const response = await roleService.getParticularRolesAndPermissionList(data);
            const mainArray = response?.data?.capability;
            let newArr1 = [];
            for (let i = 0; i < mainArray.length; i++) {
                const element = mainArray[i];
                const moduleName = element?.name;
                const menu = element?.menu;
                let array2 = []
                for (let i = 0; i < menu.length; i++) {
                    let dataObject = {
                        module: "",
                        feature: "",
                        menuList: {},

                    }
                    const menuElement = menu[i];
                    dataObject.module = moduleName;
                    dataObject.feature = menuElement?.displayName;
                    dataObject.menuList = menuElement?.subMenus;
                    array2.push(dataObject)
                }
                newArr1 = [...newArr1, ...array2]
            }
            setRolesListData2(newArr1);
            setPageLoading(false)
        } catch (error) {
            console.log("Error while getting particular Roles And Permission", error);
        }

    }

    // function handleCheckBox(id, feature) {
    //     const newArr = rolesListData2.map((item) => {
    //         if (item?.feature == feature) {
    //             for (const key in item?.menuList) {
    //                 if (item?.menuList.hasOwnProperty(key)) { // Check to ensure it's the object's own property
    //                     console.log(`${key}`);
    //                     const value = item?.menuList[key];
    //                     if (value.id == id) {
    //                         item.menuList[key].access = !item.menuList[key].access;
    //                         return item
    //                     }
    //                 }
    //             }
    //         } else {
    //             return item
    //         }
    //     });
    //     setRolesListData2(newArr)
    // }

    // function convertMenuData(inputData) {
    //     const output = [];
    //     const moduleMap = {};

    //     inputData.forEach(item => {
    //         const { module, feature, menuList } = item;

    //         // Create a new module entry if it doesn't exist
    //         if (!moduleMap[module]) {
    //             moduleMap[module] = {
    //                 name: module,
    //                 access: false,
    //                 menu: [],
    //             };
    //             output.push(moduleMap[module]);
    //         }

    //         // Check if any access is true in the menuList
    //         const hasAccess = Object.values(menuList).some(menuItem => menuItem.access === true);

    //         // Create a new menu entry
    //         const menuEntry = {
    //             subMenus: menuList,
    //             name: feature.replace("All ", ""), // Remove "All " from the feature name
    //             displayName: feature,
    //             access: hasAccess, // Set access based on the menuList
    //         };

    //         // Add the menu entry to the corresponding module
    //         moduleMap[module].menu.push(menuEntry);

    //         // If the menu has access, set the module access to true
    //         if (hasAccess) {
    //             moduleMap[module].access = true;
    //         }
    //     });

    //     return output;
    // }

    function handleCheckBox(id, feature) {
        const newArr = rolesListData.map((item) => {
            if (item?.feature == feature) {
                for (const key in item?.menuList) {
                    if (item?.menuList.hasOwnProperty(key)) { // Check to ensure it's the object's own property
                        console.log(`${key}`);
                        const value = item?.menuList[key];
                        if (value.id == id) {
                            item.menuList[key].access = !item.menuList[key].access;
                            return item
                        }
                    }
                }
            } else {
                return item
            }
        });
        setRolesListData(newArr)
    }

    function convertMenuData(inputData) {
        const output = [];
        const moduleMap = {};

        inputData.forEach(item => {
            const { module, feature, menuList } = item;

            // Create a new module entry if it doesn't exist
            if (!moduleMap[module]) {
                moduleMap[module] = {
                    name: module,
                    access: false,
                    menu: [],
                };
                output.push(moduleMap[module]);
            }

            // Check if any access is true in the menuList
            const hasAccess = Object.values(menuList).some(menuItem => menuItem.access === true);

            // Create a new menu entry
            const menuEntry = {
                subMenus: menuList,
                name: feature.replace("All ", ""), // Remove "All " from the feature name
                displayName: feature,
                access: hasAccess, // Set access based on the menuList
            };

            // Add the menu entry to the corresponding module
            moduleMap[module].menu.push(menuEntry);

            // If the menu has access, set the module access to true
            if (hasAccess) {
                moduleMap[module].access = true;
            }
        });

        return output;
    }

    async function handleSubmitRoles(e) {
        e.preventDefault();
        setLoading(true)
        const result = convertMenuData(rolesListData);
        const dataObject = {
            roleId: id,
            capability: result
        }
        try {
            const response = await roleService.submitRolesAndPermission(dataObject)
            toast.success(response?.data?.message)
            setLoading(false)
            navigate("/roles-permissions-list")
        } catch (error) {
            console.log("Error while Submitting Roles And Permission", error);
        }

    }





    return (
        <>

            <div className={` dark:bg-darkSecondary text-white  bg-white`}>

                <div>

                    {
                        pageLoading ? <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                height: "80vh",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <span className=" mt-1 font-medium  text-sm flex flex-col py-5">
                                {" "}
                                <FormLoader />
                                {/* <img src={loadingImg} alt="" className="w-24 py-5" />
            <p className="text-bold text-xl">Loading ...</p> */}
                            </span>
                        </div>
                            :
                            <div className=' md:mx-auto px-0  pb-5  rounded-b-3xl'>
                                <div className='flex flex-col dark:border-darkSecondary border-lightBorderColor  md:mx-auto px-0  h-full'>
                                    <div className='  px-4 py-5 flex justify-between items-center h-auto '>
                                        <div>
                                            <h1 className='text-xl'>Assign Permission to {name}</h1>
                                        </div>
                                    </div>

                                    <div className='overflow-x-auto px-4'>
                                        <table className="min-w-full mt-5">
                                            <thead className="bg-lightBtn dark:bg-darkBtn dark:text-white sticky top-0">
                                                <tr className="border-b border-dashed border-lighttableBorderColor">
                                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold  tracking-wider">
                                                        Module
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-center text-xs font-semibold  tracking-wider">
                                                        Feature
                                                    </th>
                                                    <th scope="col" className="px-6 w-10 py-3 text-center text-xs font-semibold  tracking-wider">
                                                        View
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 w-10 text-center text-xs font-semibold  tracking-wider">
                                                        Create
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 w-10 text-center text-xs font-semibold  tracking-wider">
                                                        Edit
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 w-10 text-center text-xs font-semibold  tracking-wider">
                                                        Delete
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 w-10 text-center text-xs font-medium uppercase tracking-wider">
                                                        IsActive
                                                    </th>
                                                    {/* <th scope="col" className="px-6 py-3 w-10 text-center text-xs font-medium uppercase tracking-wider">
                                                    List
                                                </th> */}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-darkAccent">
                                                {rolesListData && rolesListData.length > 0 && (() => {
                                                    // Group by module name and calculate row spans
                                                    const moduleRowSpanMap = {};
                                                    rolesListData.forEach((item, index) => {
                                                        if (!moduleRowSpanMap[item.module]) {
                                                            moduleRowSpanMap[item.module] = 1;
                                                        } else {
                                                            moduleRowSpanMap[item.module]++;
                                                        }
                                                    });

                                                    let renderedModules = new Set(); // Track rendered modules to avoid duplicates

                                                    return rolesListData.map((item, index) => (
                                                        <tr key={index} className="border-b border-dashed border-lighttableBorderColor">
                                                            {/* Module Cell */}
                                                            {!renderedModules.has(item.module) && (
                                                                <td
                                                                    rowSpan={moduleRowSpanMap[item.module]}
                                                                    className="px-6 py-4 whitespace-nowrap border-r border-dashed border-lighttableBorderColor text-center text-sm font-medium text-tableTextColor dark:text-white"
                                                                >
                                                                    {item.module}
                                                                </td>
                                                            )}
                                                            {/* Avoid re-rendering the module */}
                                                            {renderedModules.add(item.module) && null}

                                                            {/* Feature Cell */}
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                {item.feature}
                                                            </td>

                                                            {/* Action Columns */}
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                {/* <input className='w-4 h-4' type="checkbox" disabled={item?.menuList?.view?.disabled} checked={item?.menuList?.view?.access} onChange={() => handleCheckBox(item?.menuList?.view?.id, item?.feature)} /> */}
                                                                <div
                                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${item?.menuList?.view?.access ? "bg-lightBtn" : "bg-darkBtn"
                                                                        }`}
                                                                    onClick={() => !item?.menuList?.view?.disabled && handleCheckBox(item?.menuList?.view?.id, item?.feature)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform ${item?.menuList?.view?.access ? "translate-x-4" : "translate-x-0"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                {/* <input className='w-4 h-4' type="checkbox" disabled={item?.menuList?.create?.disabled} checked={item?.menuList?.create?.access} onChange={() => handleCheckBox(item?.menuList?.create?.id, item?.feature)} /> */}
                                                                <div
                                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer  ${item?.menuList?.create?.access ? "bg-lightBtn" : "bg-darkBtn"
                                                                        }`}
                                                                    onClick={() => !item?.menuList?.create?.disabled && handleCheckBox(item?.menuList?.create?.id, item?.feature)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform ${item?.menuList?.create?.access ? "translate-x-4" : "translate-x-0"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                {/* <input className='w-4 h-4' type="checkbox" disabled={item?.menuList?.update?.disabled} checked={item?.menuList?.update?.access} onChange={() => handleCheckBox(item?.menuList?.update?.id, item?.feature)} /> */}
                                                                <div
                                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${item?.menuList?.update?.access ? "bg-lightBtn" : "bg-darkBtn"
                                                                        }`}
                                                                    onClick={() => !item?.menuList?.update?.disabled && handleCheckBox(item?.menuList?.update?.id, item?.feature)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform ${item?.menuList?.update?.access ? "translate-x-4" : "translate-x-0"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                {/* <input className='w-4 h-4' type="checkbox" disabled={item?.menuList?.softDelete?.disabled} checked={item?.menuList?.softDelete?.access} onChange={() => handleCheckBox(item?.menuList?.softDelete?.id, item?.feature)} /> */}
                                                                <div
                                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${item?.menuList?.softDelete?.access ? "bg-lightBtn" : "bg-darkBtn"
                                                                        }`}
                                                                    onClick={() => !item?.menuList?.softDelete?.disabled && handleCheckBox(item?.menuList?.softDelete?.id, item?.feature)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform ${item?.menuList?.softDelete?.access ? "translate-x-4" : "translate-x-0"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                                {/* <input className='w-4 h-4' type="checkbox" disabled={item?.menuList?.activeActive?.disabled} checked={item?.menuList?.activeActive?.access} onChange={() => handleCheckBox(item?.menuList?.activeActive?.id, item?.feature)} /> */}
                                                                <div
                                                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${item?.menuList?.activeActive?.access ? "bg-lightBtn" : "bg-darkBtn"
                                                                        }`}
                                                                    onClick={() => !item?.menuList?.activeActive?.disabled && handleCheckBox(item?.menuList?.activeActive?.id, item?.feature)}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform ${item?.menuList?.activeActive?.access ? "translate-x-4" : "translate-x-0"
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </td>
                                                            {/* <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-tableTextColor dark:text-white">
                                                            <input type="checkbox" disabled={item?.menuList?.list?.disabled} checked={item?.menuList?.list?.access} onChange={() => handleCheckBox(item?.menuList?.list?.id, item?.feature)} />
                                                        </td> */}
                                                        </tr>
                                                    ));
                                                })()}
                                            </tbody>
                                        </table>


                                    </div>
                                    <div className="flex flex-wrap items-center mt-5 px-6 pb-4">
                                        <div className="w-full text-right">
                                            <Button
                                                text="Save"
                                                className="btn btn-sm dark:bg-darkBtn text-white dark:hover:bg-darkBtnHover bg-lightBtn   hover:bg-lightHoverBgBtn mt-1 md:mt-2 px-4 py-2 rounded hover:text-white"
                                                onClick={handleSubmitRoles}
                                                isLoading={loading}
                                            />


                                        </div>
                                    </div>




                                </div>
                            </div>
                    }

                </div>

            </div>




        </>
    )
}

export default AssignPermission