"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface CandidateData {
  candidat: string;
  score: number;
  date: string;
  email: string;
  phone: string;
  final_decision: string;
}

export default function Page() {
  const columnDefs: ColDef[] = [
    { field: "candidat" },
    { field: "score" },
    { field: "date" },
    { field: "email" },
    { field: "phone" },
    { field: "final_decision" },
  ];

  const [datas, setDatas] = useState<CandidateData[]>([]);

  useEffect(() => {
    const fetchToken = async () => {
      const datas = await getData();
      setDatas(datas);
    };

    fetchToken();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="w-full h-[35vw] max-h-[600px] flex items-center justify-center overflow-auto px-6 sm:h-[500px] md:h-[600px] lg:h-[700px]">
                <div className="w-full h-full">
                  <AgGridReact
                    className="w-full h-full"
                    rowData={datas}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationPageSize={12}
                    paginationPageSizeSelector={[12, 20, 50, 100]}
                    domLayout="normal"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function getToken() {
  const params: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "password",
      username: "stage@rocket4sales.com",
      password: "stagestage",
    }),
  };
  const url: string = "http://13.37.241.212:3000/token";
  try {
    const rep: Response = await fetch(url, params);

    if (!rep.ok) {
      throw new Error("Erreur OK dans la requête getToken");
    }
    return await rep.json();
  } catch (error) {
    throw new Error("Erreur dans la requête getToken" + error);
  }
}

async function getData() {
  const token = await getToken();

  const params = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token["access_token"],
    },
  };
  const url: string =
    "http://13.37.241.212:3000/cv_analyzer_2?deal_id=1&accepted=false&all=false&archived=true";
  try {
    const rep: Response = await fetch(url, params);

    if (!rep.ok) {
      throw new Error("Erreur OK dans la requête getData");
    }

    const data = await rep.json();
    return data["data"];
  } catch (error) {
    throw new Error("catch error getData" + error);
  }
}

// Fonction supprimée car non utilisée
// async function formatCardData() {
//   const data = await getData();
//   return [
//     {
//       title: "Total CV",
//       number: data.length,
//       tag: +34,
//       description_tag: "string",
//       description: "de",
//     },
//     {
//       title: "Total accepted",
//       number: 23,
//       tag: +34,
//       description_tag: "string",
//       description: "de",
//     },
//     {
//       title: "Total CV",
//       number: 23,
//       tag: +34,
//       description_tag: "string",
//       description: "de",
//     },
//   ];
// }
