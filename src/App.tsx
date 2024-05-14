import React from 'react';
import SearchForm from './components/SearchForm';

function App() {
  return (
    <main>
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="barcode text-8xl">
          Getflix
        </h1>
        <SearchForm/>
      </div>
    </main>
  );
}

export default App;
