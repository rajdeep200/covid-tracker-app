import React from 'react'
import MoonLoader from "react-spinners/MoonLoader";
import "./loader.css"

const Loader = () => {
    return (
        <div className="loader">
            <MoonLoader color="#ff0000" size={100} />
        </div>
    )
}

export default Loader
