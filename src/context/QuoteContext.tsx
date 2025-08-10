"use client";

import { createContext, useState, useContext, ReactNode } from 'react';

interface Quote {
  text: string;
}

interface QuoteContextType {
  selectedQuote: Quote;
  setSelectedQuote: (quote: Quote) => void;
}

const defaultQuote = { text: "Every line of code is a step away from average." };

const QuoteContext = createContext<QuoteContextType>({
  selectedQuote: defaultQuote,
  setSelectedQuote: () => {},
});

export const useQuote = () => useContext(QuoteContext);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [selectedQuote, setSelectedQuote] = useState<Quote>(defaultQuote);

  return (
    <QuoteContext.Provider value={{ selectedQuote, setSelectedQuote }}>
      {children}
    </QuoteContext.Provider>
  );
};
