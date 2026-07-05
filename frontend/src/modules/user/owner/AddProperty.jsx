import React from 'react';
import PropertyForm from './PropertyForm';

const AddProperty = ({ closeForm, loadDashboardData }) => {
  return (
    <PropertyForm 
      editMode={false} 
      editingProperty={null} 
      closeForm={closeForm} 
      loadDashboardData={loadDashboardData} 
    />
  );
};

export default AddProperty;
