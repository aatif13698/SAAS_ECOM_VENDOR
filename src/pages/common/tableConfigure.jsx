import useDarkmode from '@/hooks/useDarkMode';
import React from 'react'

const tableConfigure = () => {
    const [isDark] = useDarkmode()
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
  return {
    noDataStyle, customStyles
  }
}

export default tableConfigure