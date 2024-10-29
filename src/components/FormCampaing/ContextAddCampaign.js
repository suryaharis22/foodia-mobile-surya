// src/components/FormCampaing/ContextAddCampaign.jsx
import React, { createContext, useContext, useState } from 'react';

const ContextAddCampaign = createContext();

export const ContextAddCampaignProvider = ({ children }) => {
    const [formData, setFormData] = useState(null);

    const updateFormData = (newData) => {
        setFormData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };

    return (
        <ContextAddCampaign.Provider value={{ formData, updateFormData }}>
            {children}
        </ContextAddCampaign.Provider>
    );
};

export const useContextAddCampaign = () => {
    return useContext(ContextAddCampaign);
};
