import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>
    <Toaster position="top-right" />
  </React.StrictMode>
);
