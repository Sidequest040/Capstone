import React from 'react';
import Overview from './Overview';
import TechnicalPlans from './TechnicalPlans';

function Content({ activeSection }) {
    const renderSection = () => {
        switch(activeSection) {
            case 'overview':
                return <Overview />;
            case 'technical':
                return <TechnicalPlans />;
            // Add other cases for different sections
            default:
                return <Overview />;
        }
    };

    return (
        <div className="content">
            {renderSection()}
        </div>
    );
}

export default Content;
