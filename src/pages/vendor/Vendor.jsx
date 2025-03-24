import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import "react-contexify/dist/ReactContexify.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "@/hooks/useDarkMode";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card } from "@mui/material";
import vendorService from "@/services/vendor/vendor.service";
import debounceFunction from "@/helper/Debounce";

import loadingImg from "../../assets/images/aestree-logo.png"

// const FormValidationSchema = yup
//   .object({
//     question: yup.string().required("Question is Required"),
//     answer: yup.string().required("Answer is Required"),
//   })
//   .required();


const Vendors = ({ roleId }) => {


  useEffect(() => {
    if (roleId !== 1) {
      navigate("/dashboard");
      return;
    }
    return;
  }, []);


  // const {
  //   register,
  //   reset,
  //   formState: { errors },
  //   handleSubmit,
  //   setValue,
  // } = useForm({
  //   resolver: yupResolver(FormValidationSchema),
  // });


  const [isDark] = useDarkMode();

  const [pending, setPending] = useState(true);
  const [totalRows, setTotalRows] = useState();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isViewed, setIsViewed] = useState(false);
  const [userId, setUserId] = useState(null);
  const inputBoxStyle = {
    backgroundColor: isDark ? "#0F172A" : "",
    padding: "12px 14px",
    border: isDark ? "1px solid white" : "1px solid black",
    height: "38px",
    borderRadius: "0.5rem",
  };

  const noDataStyle = {
    color: isDark
      ? "rgb(203 213 225 / var(--tw-text-opacity))"
      : "rgb(15 23 42 / var(--tw-text-opacity))",
    fontSize: "1rem"
  };

  //   --- Adding Custom Style --------------
  const customStyles = {
    header: {
      // For Heading
      style: {
        minheight: "56px",
        color: isDark ? "rgb(29 55 54 / var(--tw-bg-opacity))" : "green",
        fontWeight: "bold",
        backgroundColor: isDark
          ? " #007475"
          : "#C9FEFF",
      },
    },
    subHeader: {
      style: {
        backgroundColor: isDark
          ? "rgb(29 55 54 / var(--tw-bg-opacity))"
          : "white",
        padding: "1.25rem",
        fontSize: "1.125rem",
        fontWeight: "500",
        lineHeight: "24px",
        color: isDark
          ? "rgb(203 213 225 / var(--tw-text-opacity))"
          : "rgb(15 23 42 / var(--tw-text-opacity))",
      },
    },
    headRow: {
      style: {
        color: isDark
          ? "rgb(203 213 225 / var(--tw-text-opacity))"
          : "rgb(71 85 105 / var(--tw-text-opacity))",
        fontSize: "0.75rem",
        fontWeight: "bold",
        backgroundColor: isDark
          ? "#007475"
          : "#C9FEFF",
        // FontFamily: "Inter, sans-serif",
        lineHeight: "1rem",
        textTransform: "uppercase",
        textOpacity: "1",
        letterSpacing: "1px",
        textAlign: "center",
        // borderBottomWidth: "1px",
        // borderBottomColor: "#bdbdbd",
        // borderBottomStyle: "dashed",
      },
    },
    // headcell
    headCells: {
      style: {
        backgroundColor: isDark ? "rgb(0 116 117 / var(--tw-bg-opacity))" : "",  //its is darkAccent backgroundColor
        color: isDark
          ? "rgb(203 213 225 / var(--tw-text-opacity))"
          : "rgb(71 85 105 / var(--tw-text-opacity))",

        fontWeight: "bold",
        fontSize: "0.75rem",
        textAlign: "center",
        paddingTop: "20px",
        paddingBottom: "15px",


      },
    },
    cells: {
      style: {
        backgroundColor: isDark ? " rgb(10 41 43 / var(--tw-bg-opacity))" : "", //its is darkAccent backgroundColor
        color: isDark
          ? "rgb(203 213 225 / var(--tw-text-opacity))"
          : "rgb(71 85 105 / var(--tw-text-opacity))",
        fontSize: "0.875rem",
        padding: "1.25rem",
        // FontFamily: "Inter, sans-serif",
        lineHeight: "1rem",
        // textTransform: "capitalize",
        textOpacity: "1",
        letterSpacing: "1px",
        textAlign: "center",


      },
    },
    selectableRows: {
      style: {
        backgroundColor: "red",
        color: "red",


      },
    },
    pagination: {
      style: {
        backgroundColor: isDark
          ? "rgb(10 41 43 / var(--tw-bg-opacity))" //its is darkAccent backgroundColor
          : "white",
        color: isDark
          ? "rgb(203 213 225 / var(--tw-text-opacity))"
          : "rgb(71 85 105 / var(--tw-text-opacity))",
        fontSize: "15px",
      },
    },
  };

  const [refresh, setRefresh] = useState(0);

  //  ---- Performing the Action After clicking on the view button---
  // This function helps us to move on top side
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This makes the scrolling smooth
    });
  };
  const scrollToBottom = () => {
    const bottomElement = document.documentElement;
    bottomElement.scrollIntoView({ behavior: "smooth", block: "end" });
  };
  const handleView = (row) => {
    scrollToTop();
    const id = row._id;
    setUserId(id);
    setIsViewed(true);
    navigate("/create-vendor", { state: { id, row } });
  };
  //   --- Deletiing the Particulare Row
  const handleDelete = (row) => {
    const id = row.id;
    Swal.fire({
      title: `Are You Sure You Want To Permanantly Delete${row?.firstName + " " + row?.lastName
        }?`,
      icon: "error",
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonText: "Cancel",

      customClass: {
        popup: "sweet-alert-popup-dark-mode-style",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteVendor(id)
      }
    });
  };



  async function deleteVendor(id) {
    try {

      const dataObject = {
        keyword: keyWord,
        page: page,
        perPage: perPage,
        id: id,
      }

      const response = await vendorService.deleteVendor(dataObject);

      setTotalRows(response?.data?.count);
      setPaginationData(response?.data?.listVendors);

      toast.success(`Deleted Successfully"}`)



    } catch (error) {
      console.error("Error while fetching manufacturer:", error);
    }
  }


  //   ---- Active And InActive the Row
  const handleActive = async (row) => {
    const id = row.id;
    let status = 1;

    row.isActive == 1 ? (status = 0) : (status = 1);

    try {

      const dataObject = {
        keyword: keyWord,
        page: page,
        perPage: perPage,
        status: status,
        id: id
      }

      const response = await vendorService.activeInactiveVendor(dataObject);

      setTotalRows(response?.data?.count);
      setPaginationData(response?.data?.listVendors);

      toast.success(`${status == 0 ? "Deactivated Successfully" : "Activated Successfully"}`)



    } catch (error) {
      console.error("Error while fetching manufacturer:", error);
    }

  };
  //   ------- Data Table Columns ---
  const columns = [
    {
      name: "Name",
      selector: (row) => row?.firstName + " " + row?.lastName,
      sortable: true,
      style: {
        width: "20px", // Set the desired width here
      },
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      style: {
        width: "20px", // Set the desired width here
      },
    },

    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      style: {
        width: "20px", // Set the desired width here
      },
    },

    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
      style: {
        width: "20px", // Set the desired width here
      },
    },

    {
      name: "Status",
      sortable: true,

      selector: (row) => {

        console.log("row",row);
        
        return (
          <span className="block w-full">
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25  ${row?.isActive == 1 ? "text-success-500 bg-success-500" : ""
                }
            ${row?.isActive == 0 ? "text-warning-500 bg-warning-500" : ""}

             `}
              title={
                row?.isActive == 1
                  ? "Click To Deactivate"
                  : "Click To Activate"
              }
              onClick={() => handleActive(row)}
            >
              {row.isActive == 1 ? "Active" : "Inactive"}
            </span>
          </span>
        );
      },
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div className="flex  space-x-1 rtl:space-x-reverse ">
            <Tooltip
              content="View"
              placement="top"
              arrow
              animation="shift-away"
            >
              <button
                className="action-btn"
                type="button"
                onClick={() => handleView(row)}
              >
                <Icon icon="heroicons:eye" />
              </button>
            </Tooltip>
            <Tooltip
              content="Delete"
              placement="top"
              arrow
              animation="shift-away"
              theme="danger"
            >
              <button
                className="action-btn"
                type="button"
                onClick={() => handleDelete(row)}
              >
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  //------ Applying server side Pagination------
  // const [paginationData, setPaginationData] = useState(records);
  const [paginationData, setPaginationData] = useState();

  // FIlter the Data Based on the search
  const [filterData, setFilterData] = useState();
  const [keyWord, setkeyWord] = useState("");
  const handleFilter = (e) => {
    let currentKeyword = e.target.value;
    setkeyWord(currentKeyword);
    debounceSearch(currentKeyword);
  };

  const debounceSearch = useCallback(
    debounceFunction(
      async (nextValue) => {
        try {
          const response = await vendorService.getAllVendors(page, keyWord = nextValue, perPage);
          setTotalRows(response?.count);
          setPaginationData(response?.listOfVendor);
        } catch (error) {
          console.error("Error while fetching vensors:", error);
        }
      },
      1000
    ),
    []
  );


  async function getVendorList() {
    try {
      const response = await vendorService.getAllVendors(page, keyWord, perPage);
      setTotalRows(response?.count);
      setPaginationData(response?.listOfVendor);
      setPending(false);
    } catch (error) {
      setPending(false);
      console.log("error while fetching vendors");
    }
  }

  useEffect(() => {
    getVendorList()
  }, [refresh]);

  // ------Performing Action when page change -----------
  const handlePageChange = async (page) => {
    try {
      const response = await vendorService.getAllVendors(page, keyWord, perPage);
      setTotalRows(response?.count);
      setPaginationData(response?.listOfVendor);
      setPage(page);
    } catch (error) {
      console.log("error while fetching coupons");
    }
  };
  // ------Handling Action after the perPage data change ---------
  const handlePerRowChange = async (perPage) => {
    try {
      const response = await vendorService.getAllVendors(page, keyWord, perPage);
      setTotalRows(response?.count);
      setPaginationData(response?.listOfVendor);
      setPerPage(perPage);
    } catch (error) {
      console.log("error while fetching coupons");
    }
    setPerPage(perPage);
  };

  // -----Adding a Search Box ---------

  const subHeaderComponent = (
    <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  items-center">
      <div className="table-heading text-start ">Vendors List</div>
      <div className="grid lg:justify-end md:justify-start">
        <input
          type="text"
          placeholder="Search.."
          // style={inputBoxStyle}
          onChange={handleFilter}
          className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkSecondary text-lightinputTextColor  bg-lightBgInputColor dark:bg-darkInput dark:text-white"
        />
      </div>
    </div>
  );

  const handleBack = () => {
    navigate("/layout/dashboard");
  };

  const paginationOptions = {
    rowsPerPageText: "row",
    rangeSeparatorText: "of",
  };
  return (
    <div className={`${isDark ? "bg-darkSecondary text-white" : ""}`}>
      <Card></Card>
      <div className="text-end mb-4">
        <div className="flex gap-5 justify-between"></div>
      </div>

      <DataTable
        columns={columns}
        data={paginationData}
        highlightOnHover
        customStyles={customStyles}
        fixedHeader
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowChange}
        // selectableRows
        pointerOnHover
        progressPending={pending}
        subHeader
        subHeaderComponent={subHeaderComponent}
        paginationComponentOptions={paginationOptions}
        noDataComponent={<div className={`${isDark ? "bg-darkBody" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>

          <p className="text-center text-bold text-2xl" style={noDataStyle}>
            There is no record to display
          </p>
        </div>
        }
        progressComponent={

          <div style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", background: isDark ? "#0F172A" : "", width: "100%" }}>
            <img src={loadingImg} alt="No Data Image" style={{ height: "2rem", width: "2rem" }} />

            <p className="text-center text-bold text-2xl" style={noDataStyle}>
              Processing...
            </p>
          </div>

        }

      />
    </div>
  );
};

export default Vendors;
