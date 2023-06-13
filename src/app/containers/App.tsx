import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Main } from 'app/containers/pages/Main';

const AppPage = styled.div``;

export const App = () => {
    return (
        <AppPage>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to='/main' />} />
                    <Route path='/main' element={<Main />} />
                </Routes>
            </BrowserRouter>
        </AppPage>
    );
};
