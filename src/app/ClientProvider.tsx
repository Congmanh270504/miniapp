"use client";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/navbar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { store } from "@/store/store";
import ActionSearchBar from "@/components/action-sreach-bar";
import { QueryProvider } from "./providers";
import Footer from "@/components/footer";

interface ClientProviderProps {
  children: React.ReactNode;
}

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const pathName = usePathname();
  const pathArray = pathName.split("/").slice(1);
  const breadcrumbItems = pathArray.reduce<string[]>((acc, item, index) => {
    const url = `${acc[index - 1] || ""}/${item}`;
    acc.push(url);
    return acc;
  }, []);

  return (
    <Provider store={store}>
      <QueryProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="sticky top-0 z-[9999] bg-background/2 backdrop-blur-md border-b border-border/30 flex h-16 shrink-0 items-center gap-2 transition-all duration-200 ease-linear">
              <div className="flex items-center gap-2 px-4 w-full">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 h-4 bg-gray-300 dark:bg-gray-500"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    {breadcrumbItems.map((url, index) => (
                      <div key={index} className="flex items-center">
                        <BreadcrumbItem>
                          {index !== breadcrumbItems.length - 1 ? (
                            <BreadcrumbLink href={url} className="capitalize">
                              {pathArray[index]}
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="capitalize">
                              {pathArray[index]}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {index !== pathArray.length - 1 && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                      </div>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
                <ActionSearchBar />
              </div>
            </header>
            <main className="flex-1 w-full overflow-auto">{children}</main>

            {/* Footer - Luôn ở cuối */}
            <Footer />
          </SidebarInset>
        </SidebarProvider>
        <Toaster richColors closeButton position="bottom-right" />
      </QueryProvider>
    </Provider>
  );
};

export default ClientProvider;
