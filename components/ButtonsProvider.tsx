"use client";

import { useEffect, useContext } from "react";
import { DataContext } from "@/app/workspace/layout";

interface ButtonsProviderProps {
  children: React.ReactNode;
}

export default function ButtonsProvider({ children }: ButtonsProviderProps) {
  const { setData } = useContext(DataContext);

  useEffect(() => {
    setData(children);
  }, [children, setData]);

  return null;
}
