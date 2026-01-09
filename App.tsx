
import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { IndustryProvider } from './context/IndustryContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { routes } from './routes';

// Use HashRouter for better compatibility with dynamic base URLs and previews
const router = createHashRouter(routes);

const App = () => (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <FeatureFlagProvider>
                <I18nProvider>
                    <IndustryProvider>
                        <RouterProvider router={router} />
                    </IndustryProvider>
                </I18nProvider>
            </FeatureFlagProvider>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
);

export default App;
