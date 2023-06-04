import React from 'react';
import { Redirect } from 'react-router-dom';

export const ProtectedRoute = ({
    imageList,
    redirectPath = '/',
    children,
  }) => {
    if (!imageList || imageList.length === 0) {
      return <Redirect to={redirectPath} />;
    }
  
    return children;
  };