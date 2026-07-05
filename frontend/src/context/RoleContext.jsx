import React, { createContext, useState } from 'react';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState(() => {
    return localStorage.getItem('househunt_role') || null;
  });

  const setRole = (role) => {
    setSelectedRole(role);
    if (role) {
      localStorage.setItem('househunt_role', role);
    } else {
      localStorage.removeItem('househunt_role');
    }
  };

  return (
    <RoleContext.Provider value={{ selectedRole, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};
