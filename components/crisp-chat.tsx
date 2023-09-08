"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("b45351f0-19f8-489e-af87-bbbdd8b08107");
  }, []);

  return null;
};
