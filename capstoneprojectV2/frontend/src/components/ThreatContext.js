import React, { createContext, useState } from 'react';

const ThreatContext = createContext();

const ThreatProvider = ({ children }) => {
    const [threatData, setThreatData] = useState([]);

    return (
        <ThreatContext.Provider value={{ threatData, setThreatData }}>
            {children}
        </ThreatContext.Provider>
    );
};

export { ThreatContext, ThreatProvider };
